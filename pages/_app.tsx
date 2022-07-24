import '../styles/globals.scss'
import 'styles/components/input.scss'
import 'styles/components/spinner.scss'
import 'styles/components/dialog.scss'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
