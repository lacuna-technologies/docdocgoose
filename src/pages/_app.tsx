import type { AppProps } from 'next/app'
import Script from 'next/script'
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
      <Component {
        ...{
          ...pageProps,
          app: {
            wasmLoaded,
            go: PdfCpu.go,
          }
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
