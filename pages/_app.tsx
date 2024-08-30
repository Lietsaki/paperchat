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

        {/* META */}
        <meta name="theme-color" content="#cbcbcb" />
        <meta name="color-scheme" content="light only" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ricardo Sandez - Lietsaki" />
        <meta
          name="keywords"
          content="paperchat, pictochat online, drawing online, live drawing app, nintendo pictochat, DS drawing app, by lietsaki"
        />
        <meta
          name="description"
          content="Draw in real time with your friends or random people in an online Pictochat version."
        />

        {/* OG META TAGS */}
        <meta property="og:title" content="Paperchat - An online Pictochat spiritual successor" />
        <meta
          property="og:description"
          content="Draw in real time with your friends or random people in an online Pictochat version."
        />
        <meta property="og:image" content="https://paperchat.net/meta_images/paperchat_net.png" />
        <meta property="og:url" content="https://paperchat.net/" />
        <meta property="og:type" content="website" />

        {/* TWITTER META TAGS */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Paperchat - An online Pictochat spiritual successor" />
        <meta
          name="twitter:description"
          content="Draw in real time with your friends or random people in an online Pictochat version."
        />
        <meta name="twitter:image" content="https://paperchat.net/meta_images/paperchat_net.png" />

        {/* FAVICON */}
        <link rel="icon" type="image/ico" href="/favicons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />

        {/* FONTS */}
        <link
          rel="preload"
          href="/fonts/nds.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="true"
        ></link>
      </Head>
      <AppNotificationsCleaner />

      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
