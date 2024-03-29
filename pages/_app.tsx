import '../styles/globals.scss'
import 'styles/components/input.scss'
import 'styles/components/spinner.scss'
import 'styles/components/dialog.scss'
import type { AppProps } from 'next/app'
import { store } from 'store/store'
import { Provider } from 'react-redux'
import initializeFirebase from 'firebase-config/init'
import Head from 'next/head'
import AppNotificationsCleaner from 'components/AppNotificationsCleaner'
import { Capacitor } from '@capacitor/core'
import { createNotificationsChannel } from 'helpers/localNotifications'

if (typeof window !== 'undefined') {
  initializeFirebase()

  if (Capacitor.isNativePlatform()) {
    createNotificationsChannel()
  }

  // Samsung's browser ignores color-scheme.
  if (navigator.userAgent.match(/samsung/i)) {
    alert(
      'Your browser (Samsung Internet) is not designed to show this ' +
        'app correctly. Please consider switching to any popular ' +
        'standards-compliant browser instead. \n\n' +
        'We recommend Google Chrome, Firefox, or Microsoft Edge.'
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Paperchat - An online Pictochat spiritual successor</title>
        <meta
          name="description"
          content="Draw in real time with your friends or random people in an online version of Pictochat."
        />
        <meta name="color-scheme" content="light only" />

        <link
          rel="preload"
          href="/fonts/nds.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="true"
        ></link>

        <link rel="icon" type="image/ico" href="/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <meta name="theme-color" content="#cbcbcb" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="Ricardo Sandez - Lietsaki" />
        <meta
          name="keywords"
          content="paperchat, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
        />
      </Head>
      <AppNotificationsCleaner />

      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
