import type { AppProps } from 'next/app'
import Script from 'next/script'
import { useState, useEffect, useCallback } from 'react'
import Filer from 'filer'

import 'styles/globals.css'

globalThis.fs = new Filer.FileSystem({
  provider: new Filer.FileSystem.providers.Memory()
})
globalThis.fs.writeOriginal = globalThis.fs.write
globalThis.fs.write = (fd, buf, offset, length, position, callback) => {
  if(fd === 1 || fd === 2){ // stdout or stderr
    const decoder = new TextDecoder("utf-8")
    let outputBuf = "";
    outputBuf += decoder.decode(buf)
    const nl = outputBuf.lastIndexOf("\n")
    if (nl != -1) {
      console.log(outputBuf.slice(0, nl));
      outputBuf = outputBuf.slice(nl + 1)
    }
    callback(null, buf.length, buf)
  } else {
    return globalThis.fs.writeOriginal(fd, buf, offset, length, position, callback)
  }
}
globalThis.fs.writeSync = (fd, buf, offset, length, position) => {
  let done = false
  let result = null
  while(!done){
    globalThis.fs.write(fd, buf, offset, length, position, (err, bytesWritten, buffer) => {
      if(err) {
        throw err
      }
      done = true
      result = bytesWritten
    })
  }
  return result
}
globalThis.fs.openOriginal = globalThis.fs.open
globalThis.fs.open = (path, flags, mode, callback) => {
  let currentFlags = `r`
  const constants = globalThis.fs.constants

  if(flags === constants.O_RDONLY){
    currentFlags = `r`
  } else if(flags & constants.O_WRONLY) {
    currentFlags = `w`
  } else if (flags & constants.O_RDWR) {
    if (flags & constants.O_CREAT && flags & constants.O_TRUNC) {
      currentFlags = 'w+'
    } else {
      currentFlags = 'r+'
    }
  } else {
    console.log(`flags`, flags)
    throw new Error(`Unimplemented open flags`)
  }

  return globalThis.fs.openOriginal(path, currentFlags, mode, callback)
}
globalThis.fs.fstatOriginal = globalThis.fs.fstat
globalThis.fs.fstat = (fd, callback) => {
  return globalThis.fs.fstatOriginal(fd, (err, stats) => {
    let retStat = stats
    delete retStat[`version`]
    delete retStat[`filedata`]
    retStat.dev = 0
    retStat.ino = 0
    retStat.rdev = 0
    retStat.blksize = 4096
    retStat.blocks = Math.ceil(retStat.size / 512)
    retStat.atimeMs = retStat.atime.getTime()
    retStat.mtimeMs = retStat.mtime.getTime()
    retStat.ctimeMs = retStat.ctime.getTime()
    retStat.birthtimeMs = retStat.ctimeMs
    retStat.birthtime = retStat.ctime
    retStat.nlink = retStat.nlinks
    delete retStat['nlinks']
    return callback(err, retStat)
  })
}

const DocsTogether = ({ Component, pageProps }: AppProps) => {
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
      fetch(`/test2.pdf`).then(res => {
        return res.arrayBuffer()
      }).then((buffer) => {
        globalThis.fs.writeFile(`/test2.pdf`, Buffer.from(buffer), (err: any) => {
        })
      })
      setGo(new Go())
    }
  }, [wasmLoaded, go])

  useEffect(() => {
    if(go !== null){
      // runPdfCpu([`version`, `-c`, `disable`])
      runPdfCpu([`permissions`, `list`, `-v`, `/test2.pdf`])
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
