import type { AppProps } from 'next/app'
import Script from 'next/script'
import { useState, useEffect, useCallback } from 'react'
import Filer from 'filer'

import 'styles/globals.css'

var Buffer = Filer.Buffer
var fs = new Filer.FileSystem({ provider: new Filer.FileSystem.providers.Memory() })

const DocsTogether = ({ Component, pageProps }: AppProps) => {
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [go, setGo] = useState(null as any)
  const runPdfCpu = useCallback(async (params: string[]) => {
    if(go === null){
      throw new Error(`Go is not loaded`)
    }
    if(typeof fs === `undefined`){
      throw new Error(`fs is not patched`)
    }
    go.argv = [`pdfcpu.wasm`, ...params]
    go.env = { HOME: `/`, TMPDIR: `/tmp`, ...go.env }
    const result = await WebAssembly.instantiateStreaming(fetch("/wasm/pdfcpu.wasm"), go.importObject)
    go.run(result.instance)
    return go.exitCode
  }, [go])

  useEffect(() => {
    if(wasmLoaded && go === null){
      fetch(`/test.pdf`).then(res => {
        return res.arrayBuffer()
      }).then((buffer) => {
        fs.writeFile(`/test.pdf`, Buffer.from(buffer), (err: any) => {
          fs.readFile(`/test.pdf`, (e: any, contents: any) => {
            console.log(contents)
          })
        })
      })
      setGo(new Go())
    }
  }, [wasmLoaded, go])

  useEffect(() => {
    if(go !== null){
      // runPdfCpu([`version`, `-c`, `disable`])
      runPdfCpu([`properties`, `list`, `/test.pdf`, `-c`, `disable`])
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
