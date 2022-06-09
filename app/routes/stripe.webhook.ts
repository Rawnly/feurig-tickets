import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import signale from 'signale';
import Stripe from 'stripe';
import { checkoutSessionCompleted, checkoutSessionExpired, paymentIntentCreated } from '~/lib/webhooks';
import { match } from 'ts-pattern'

export const action: ActionFunction = async ({ request }) => {
	const stripe = new Stripe(process.env.STRIPE_SCRET_KEY!, {
		apiVersion: '2020-08-27'
	});

	const stripeSignature = request.headers.get('stripe-signature')

	if (  !stripeSignature ) {
		return json({
			status: 401,
			body: 'No Signature',
		}, { status: 401 })
	}

	let event: Stripe.Event | null = null
	try {
		const payload = await request.text()
		event = stripe.webhooks.constructEvent(payload, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET!)
	} catch (error) {
		signale.error(error)
		return new Response((error as Stripe.errors.StripeSignatureVerificationError).message, { status: 400 })
	}

	try {
		return await match(event)
			.with({ type: 'checkout.session.completed' }, checkoutSessionCompleted)
			.with({ type: 'checkout.session.expired' }, checkoutSessionExpired)
			.with({ type: 'payment_intent.created' }, paymentIntentCreated)
			.otherwise(event => {
				signale.warn('Unhandled event', event)
				return new Response(null, { status: 418 })
			})
	} catch (error) {
		signale.error(error)

		return json(error, {
			status: 500
		})
	}
}
