import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'

import TheHeader from './layout/TheHeader'

import bulma from '~/styles/bulma.min.css'
import media from '~/styles/media.css'

export const meta = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
})

export const links = () => [
  {
    rel: 'stylesheet', href: bulma
  },
  {
    rel: 'stylesheet', href: media
  }
]

export default function App () {
  return (
    <html lang='es'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <TheHeader />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
