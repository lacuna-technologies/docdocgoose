import { useState, useCallback, useEffect } from "react"

const usePdfCpu = (pdfPath: string) => {

  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [go, setGo] = useState(null as any)

  const runPdfCpu = useCallback(async (params: string[]) => {
    if(go === null){
      throw new Error(`Go is not loaded`)
    }
    if(typeof globalThis.fs === `undefined`){
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
      fetch(pdfPath).then(res => {
        return res.arrayBuffer()
      }).then((buffer) => {
        globalThis.fs.writeFile(pdfPath, Buffer.from(buffer), (err: any) => {
          if(err){
            throw err
          }
        })
      })
      setGo(new Go())
    }
  }, [wasmLoaded, go])
}

export default usePdfCpu