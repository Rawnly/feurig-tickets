import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindcss from './tailwind.css'
import fontawesome from '@fortawesome/fontawesome-svg-core/styles.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import Layout from './components/Layout';

config.autoAddCss = false

export const loader: LoaderFunction = async () => {
  return json( {
    ENV: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL
    }
  } )
}

export const meta: MetaFunction = () => ( {
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
} );

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: tailwindcss
  }, {
    rel: 'stylesheet',
    href: fontawesome
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700;800&display=swap'
  }
]

export default function App() {
  const data = useLoaderData()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className='dark:bg-codGray-900 bg-silver-100 text-codGray-900 dark:text-silver-300 font-mono'>
        <Layout>
          <Outlet />
        </Layout>

        <ScrollRestoration />
        <script dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify( data.ENV )}`
        }} />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
