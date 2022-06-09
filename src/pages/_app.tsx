import type { AppProps } from 'next/app'
import 'styles/globals.css'

const DocsTogether = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default DocsTogether
