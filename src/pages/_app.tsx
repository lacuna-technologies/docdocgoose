import type { AppProps } from 'next/app'
import Script from 'next/script'
import { useState, useEffect, useCallback } from 'react'

import 'styles/globals.css'

declare var Go: any // TO FIX

const DocsTogether = ({ Component, pageProps }: AppProps) => {
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [go, setGo] = useState(null as any)
  const runPdfCpu = useCallback(async (params: string[]) => {
    if(go === null){
      throw new Error(`Go is not loaded`)
    }
    go.argv = [`pdfcpu.wasm`, ...params]
    const result = await WebAssembly.instantiateStreaming(fetch("/wasm/pdfcpu.wasm"), go.importObject)
    go.run(result.instance)
    return go.exitCode
  }, [go])

  useEffect(() => {
    if(wasmLoaded && go === null){
      setGo(new Go())
    }
  }, [wasmLoaded, go])

  useEffect(() => {
    if(go !== null){
      runPdfCpu([`version`])
    }
  }, [go])

  return (
    <>
      <Component {
        ...{
          ...pageProps,
          app: {
            wasmLoaded,
            runPdfCpu,
          }
        }}
      />
      <Script
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
