import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import PdfCpu from 'utils/PdfCpu'
import PdfScout from 'utils/PdfScout'

import 'styles/globals.css'

const DocDocGoose = ({ Component, pageProps }: AppProps) => {
  const [wasmGoLoaded, setWasmGoLoaded] = useState(false)
  const [wasmPythonLoaded, setWasmPythonLoaded] = useState(false)

  useEffect(() => {
    if(wasmGoLoaded && PdfCpu.go === null){
      PdfCpu.setGo(new Go())
    }
    if(wasmPythonLoaded){
      PdfScout.init()
    }
  }, [wasmGoLoaded, wasmPythonLoaded])

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
            wasmLoaded: wasmGoLoaded && wasmPythonLoaded,
          },
        }}
      />
      <Script
        id="wasm_go"
        src="/wasm/golang/wasm_exec.js"
        onLoad={() => {
          setWasmGoLoaded(true)
        }}
      >
      </Script>
      <Script
        id="wasm_python"
        src="/wasm/pyodide/pyodide.js"
        onLoad={() => {
          setWasmPythonLoaded(true)
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
