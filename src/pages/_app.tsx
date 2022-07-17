import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import PdfCpu from 'utils/PdfCpu'

import 'styles/globals.css'

const DocDocGoose = ({ Component, pageProps }: AppProps) => {
  const [wasmLoaded, setWasmLoaded] = useState(false)

  useEffect(() => {
    if(wasmLoaded && PdfCpu.go === null){
      PdfCpu.setGo(new Go())
    }
  }, [wasmLoaded])

  return (
    <>
    <Head>
      <title>DocDocGoose</title>
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
      <Script
        id="goatcounter"
        data-goatcounter="https://stats.docdocgoose.huey.xyz/count"
        async src="//gc.zgo.at/count.js">
      </Script>
    </>
  )
}

export default DocDocGoose
