import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import PdfCpu from 'utils/PdfCpu'

import 'styles/globals.css'

const DocsTogether = ({ Component, pageProps }: AppProps) => {
  const [wasmLoaded, setWasmLoaded] = useState(false)

  useEffect(() => {
    if(wasmLoaded && PdfCpu.go === null){
      PdfCpu.setGo(new Go())
    }
  }, [wasmLoaded])

  return (
    <>
    <Head>
      <title>📄 DocsTogether</title>
    </Head>
      <Component {
        ...{
          ...pageProps,
          app: {
            go: PdfCpu.go,
            wasmLoaded,
          },
        }}
      />
      <Script
        id="wasm"
        src="/wasm/wasm_exec.js"
        onLoad={() => {
          setWasmLoaded(true)
        }}
      >
      </Script>
    </>
  )
}

export default DocsTogether
