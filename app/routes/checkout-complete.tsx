import type { LoaderFunction } from '@remix-run/node';
import { Link, useNavigate, useSearchParams } from '@remix-run/react';
import Button from '../components/Button';
import { useEffect } from 'react';

export const loader: LoaderFunction = async ({ request, params }) => {
	console.log(request.url, params);

	return new Response()
}

export default function CheckoutComplete() {
	const [params] = useSearchParams()
	const navigate = useNavigate()

	useEffect(() => {
		if (params.get('state')) return
		navigate('/')
	}, [navigate, params])

	if ( params.get('state') === 'error' ) {
		return (
			<div className='flex flex-col max-w-xl gap-4'>
			<h1 className='mb-8 text-3xl font-bold text-center text-red-500'>Checkout Error</h1>

				<p className='text-justify'>
					An error has occurred creating your order.

					Please contact us at <a className='text-purple-500 underline' href='mailto:support@flanda.eu'>support@flanda.eu</a> or
					DM us on <a className='text-purple-500 underline' href='https://instagram.com/flandacollective'>Instagram</a>.
				</p>
			</div>
		)
	}

	return (
		<div className='flex flex-col max-w-xl gap-4'>
			<h1 className='mb-8 text-3xl font-bold text-center'>Checkout Success 🎉</h1>

			<p className='text-justify'>
				You should receive an email with your <b className='text-purple-500'>TICKET</b>.
				Make sure to check your <b>spam folder</b> if you don't see it.

				For any questions, please contact us at <a className='text-purple-500 underline' href='mailto:support@flanda.eu'>support@flanda.eu</a> or
				DM us on <a className='text-purple-500 underline' href='https://instagram.com/flandacollective'>Instagram</a>.
			</p>

			<Link className='ml-auto' to='/events'>
				<Button theme='auto'>Browse other events</Button>
			</Link>
		</div>
	)
}
