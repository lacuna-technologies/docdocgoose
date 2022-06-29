import type { AppProps } from 'next/app'
import Script from 'next/script'
import { useState, useEffect, useCallback } from 'react'
import { configure, BFSRequire } from 'browserfs'

import 'styles/globals.css'

let bfs

configure({
  fs: `InMemory`,
  options: {},
}, (error) => {
  if (error) {
    throw error
  }
  bfs = BFSRequire(`fs`)
})

globalThis.fs = bfs
globalThis.fs.constants = {
  O_RDONLY: 0,
  O_WRONLY: 1,
  O_RDWR: 2,
  O_CREAT: 64,
  O_EXCL: 128,
  O_NOCTTY: 256,
  O_TRUNC: 512,
  O_APPEND: 1024,
  O_DIRECTORY: 65536,
  O_NOATIME: 262144,
  O_NOFOLLOW: 131072,
  O_SYNC: 1052672,
  O_DIRECT: 16384,
  O_NONBLOCK: 2048,
}
globalThis.fs.writeOriginal = globalThis.fs.write
globalThis.fs.write = (fd, buf, offset, length, position, callback) => {
  if(fd === 1 || fd === 2){ // stdout or stderr
    const decoder = new TextDecoder("utf-8")
    let outputBuf = "";
    outputBuf += decoder.decode(buf)
    const nl = outputBuf.lastIndexOf("\n")
    if (nl != -1) {
      if(fd === 1){
        console.log(outputBuf.slice(0, nl))
      } else {
        console.error(outputBuf.slice(0, nl))
      }
      outputBuf = outputBuf.slice(nl + 1)
    }
    callback(null, buf.length, buf)
  } else {
    return globalThis.fs.writeOriginal(fd, buf, offset, length, position, callback)
  }
}
global.fs.writeSyncOriginal = global.fs.writeSync
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
  const { constants } = globalThis.fs

  if(flags === constants.O_RDONLY || flags === `r`){
    currentFlags = `r`
  } else if(flags & constants.O_WRONLY) {
    currentFlags = `w`
  } else if (flags & constants.O_RDWR) {
    if (flags & constants.O_EXCL) {
        currentFlags = 'wx+';
    } else if (flags & constants.O_CREAT && flags & constants.O_TRUNC) {
      currentFlags = 'w+'
    } else {
      currentFlags = 'r+'
    }
  } else {
    console.log(`flags`, flags)
    console.error(`Unimplemented open flags`)
  }
  return globalThis.fs.openOriginal(path, currentFlags, mode, callback)
}
globalThis.fs.fstatOriginal = globalThis.fs.fstat
globalThis.fs.fstat = (fd, callback) => {
  return globalThis.fs.fstatOriginal(fd, (err, stats) => {
    let retStat = stats
    delete retStat[`fileData`]
    retStat.atimeMs = retStat.atime.getTime()
    retStat.mtimeMs = retStat.mtime.getTime()
    retStat.ctimeMs = retStat.ctime.getTime()
    retStat.birthtime = retStat.ctime
    retStat.birthtimeMs = retStat.birthtime.getTime()
    return callback(err, retStat)
  })
}

globalThis.fs.closeOriginal = global.fs.close
globalThis.fs.close = (fd, callback) => {
  return globalThis.fs.closeOriginal(fd, (err) => {
    if (typeof err === 'undefined'){
      err = null
    }
    return callback()
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
          if(err){
            throw err
          }
        })
      })
      setGo(new Go())
    }
  }, [wasmLoaded, go])

  useEffect(() => {
    if(go !== null){
      // runPdfCpu([`version`])
      // runPdfCpu([`validate`, `/test2.pdf`])
      runPdfCpu([`info`, `/test2.pdf`])
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
