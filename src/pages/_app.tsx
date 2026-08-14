import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NavBar } from '../../components'
import Head from 'next/head';
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito'
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${nunito.variable} max-w-295 mx-auto px-4`}>
      <Head>
        <meta name="apple-mobile-web-app-title" content="Weather" />
      </Head>

      <NavBar />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp

