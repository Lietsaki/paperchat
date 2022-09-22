import '../styles/globals.scss'
import 'styles/components/input.scss'
import 'styles/components/spinner.scss'
import 'styles/components/dialog.scss'
import type { AppProps } from 'next/app'
import { store } from 'store/store'
import { Provider } from 'react-redux'
import { initializer } from 'store/initializer'
import initializeFirebase from 'firebase-config/init'

if (typeof window !== 'undefined') {
  initializeFirebase()
  initializer()
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
