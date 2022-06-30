import type { AppProps } from 'next/app'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import PdfCpu from 'utils/PdfCpu'

import 'styles/globals.css'

const DocsTogether = ({ Component, pageProps }: AppProps) => {
  const [wasmLoaded, setWasmLoaded] = useState(false)

  useEffect(() => {
    if(wasmLoaded && PdfCpu.go === null){
      // fetch(`/test2.pdf`).then(res => {
      //   return res.arrayBuffer()
      // }).then((buffer) => {
      //   globalThis.fs.writeFile(`/test2.pdf`, Buffer.from(buffer), (err: any) => {
      //     if(err){
      //       throw err
      //     }
      //   })
      // })
      PdfCpu.setGo(new Go())
    }
  }, [wasmLoaded, PdfCpu.go])

  // useEffect(() => {
  //   if(go !== null){
  //     // runPdfCpu([`version`])
  //     // runPdfCpu([`validate`, `/test2.pdf`])
  //     runPdfCpu([`info`, `/test2.pdf`])
  //   }
  // }, [go])

  return (
    <>
      <Component {
        ...{
          ...pageProps,
          app: {
            wasmLoaded,
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
