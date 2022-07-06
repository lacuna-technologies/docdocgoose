import { configure, BFSRequire } from 'browserfs'

let bfs,
    go = null,
    stdout: string[] = [],
    stderr:string[] = []

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
  O_APPEND: 1024,
  O_CREAT: 64,
  O_DIRECT: 16384,
  O_DIRECTORY: 65536,
  O_EXCL: 128,
  O_NOATIME: 262144,
  O_NOCTTY: 256,
  O_NOFOLLOW: 131072,
  O_NONBLOCK: 2048,
  O_RDONLY: 0,
  O_RDWR: 2,
  O_SYNC: 1052672,
  O_TRUNC: 512,
  O_WRONLY: 1,
}
globalThis.fs.writeOriginal = globalThis.fs.write
globalThis.fs.write = (fd, buf, offset, length, position, callback) => {
  if(fd === 1 || fd === 2){ // stdout or stderr
    if (offset !== 0 || length !== buf.length || position !== null) {
      throw new Error(`not implemented`)
    }
    const decoder = new TextDecoder(`utf-8`)
    let outputBuf = ``
    outputBuf += decoder.decode(buf)
    const nl = outputBuf.lastIndexOf(`\n`)
    if (nl != -1) {
      // TODO: do not print in production
      if(fd === 1){
        // stdout
        console.log(outputBuf.slice(0, nl))
        stdout.push(outputBuf.slice(0, nl))
      } else {
        // stderr
        console.error(outputBuf.slice(0, nl))
        stderr.push(outputBuf.slice(0, nl))
      }
      outputBuf = outputBuf.slice(nl + 1)
    }
    callback(null, buf.length, buf)
  } else {
    buf = Buffer.from(buf)
    return globalThis.fs.writeOriginal(fd, buf, offset, length, position, callback)
  }
}
globalThis.fs.writeSyncOriginal = globalThis.fs.writeSync
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
        currentFlags = `wx+`
    } else if (flags & constants.O_CREAT && flags & constants.O_TRUNC) {
      currentFlags = `w+`
    } else {
      currentFlags = `r+`
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

globalThis.fs.lstatOriginal = globalThis.fs.lstat
globalThis.fs.lstat = (path, callback) => {
  return globalThis.fs.lstatOriginal(path, (err, stats) => {
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

globalThis.fs.closeOriginal = globalThis.fs.close
globalThis.fs.close = (fd, callback) => {
  return globalThis.fs.closeOriginal(fd, (err) => {
    if (typeof err === `undefined`){
      err = null
    }
    return callback()
  })
}

const clearStd = () => {
  stdout = []
  stderr = []
}

const run = async (params: string[]) => {
  if(go === null){
    throw new Error(`Go is not loaded`)
  }
  if(typeof globalThis.fs === `undefined`){
    throw new Error(`fs is not patched`)
  }
  go.argv = [`pdfcpu.wasm`, ...params]
  go.env = { HOME: `/`, TMPDIR: `/tmp`, ...go.env }
  const result = await WebAssembly.instantiateStreaming(fetch(`/wasm/pdfcpu.wasm`), go.importObject)
  go.run(result.instance)
  const response = {
    exitCode: go.exitCode,
    stderr: stderr.slice(),
    stdout: stdout.slice(),
  }
  clearStd()
  return response
}

const setGo = (value: any) => {
  go = value
}

export type FileInfo = {
  pdfVersion?: string,
  pageCount?: number,
  pageSize?: string,
  title?: string,
  author?: string,
  subject?: string,
  pdfProducer?: string,
  contentCreator?: string,
  creationDate?: string,
  modificationDate?: string,
  properties?: string,
  tagged?: boolean,
  hybrid?: boolean,
  linearized?: boolean,
  xrefStreams?: boolean,
  objectStreams?: boolean,
  watermarked?: boolean,
  thumbnails?: boolean,
  acroform?: boolean,
  encrypted?: boolean,
  permissions?: string,
}

const getInfo = async (filePath: string): Promise<FileInfo> => {
  const {
    exitCode,
    stdout,
    stderr,
  } = await run([`info`, filePath])

  if(exitCode === 1 || exitCode === 2){
    throw new Error(stderr.join(`\n`))
  } else if (stderr.some(l => l.includes(`decryptAESBytes: Ciphertext not a multiple of block size`))){
    throw new Error(`File is encrypted`)
  }
  let info = {} as FileInfo

  const booleanise = (val) => {
    if(val === `Yes`){
      return true
    } else if (val === `No`) {
      return false
    } else {
      throw Error(`Cannot booleanise ${val}`)
    }
  }

  const values = stdout
    .filter((line) => !line.match(/\.{10,}/))
    .reduce((acc, line, index, array) => {
      const parts = line.split(/:(?=\s|$)/).map(v => v.trim())
      if(parts[0] === `Permissions`){
        const result = [
          ...acc,
          [
            parts[0],
            [parts[1], ...array.slice(index + 1)].join(`\n`),
          ],
        ]
        array.splice(1) // early exit
        return result
      } else if(parts.length !== 2){
        return [
          ...acc.slice(0, index - 1),
          [acc[index - 1][0], acc[index - 1][1] + `\n` + line],
        ]
      } else {
        return [...acc, parts]
      }
    }, [])

  for(const value of values){
    const [label, data] = value
    switch(label){
      case `PDF version`: {
        info.pdfVersion = data
        break
      }
      case `Page count`: {
        info.pageCount = Number(data)
        break
      }
      case `Page size`: {
        info.pageSize = data
        break
      }
      case `Title`: {
        info.title = data
        break
      }
      case `Author`: {
        info.author = data
        break
      }
      case `Subject`: {
        info.subject = data
        break
      }
      case `PDF producer`: {
        info.pdfProducer = data
        break
      }
      case `Content creator`: {
        info.contentCreator = data
        break
      }
      case `Creation date`: {
        info.creationDate = data
        break
      }
      case `Modification date`: {
        info.modificationDate = data
        break
      }
      case `Properties`: {
        info.properties = data
        break
      }
      case `Tagged`: {
        info.tagged = booleanise(data)
        break
      }
      case `Hybrid`: {
        info.hybrid = booleanise(data)
        break
      }
      case `Linearized`: {
        info.linearized = booleanise(data)
        break
      }
      case `Using XRef streams`: {
        info.xrefStreams = booleanise(data)
        break
      }
      case `Using object streams`: {
        info.objectStreams = booleanise(data)
        break
      }
      case `Watermarked`: {
        info.watermarked = booleanise(data)
        break
      }
      case `Thumbnails`: {
        info.thumbnails = booleanise(data)
        break
      }
      case `AcroForm`: {
        info.acroform = booleanise(data)
        break
      }
      case `Encrypted`: {
        info.encrypted = booleanise(data)
        break
      }
      case `Permissions`: {
        info.permissions = data
        break
      }
      default: { //ignore
        break
      }
    }
  }

  return info
}

const optimise = async (filePath: string) => {
  const outPath = filePath.replace(/\.pdf$/, `-optimised.pdf`)
  const {
    exitCode,
    stdout,
    stderr,
  } = await run([`optimize`, `-v`, filePath, outPath])
  if(exitCode === 1 || exitCode === 2){
    throw new Error(stderr.join(`\n`))
  }
  return {
    exitCode,
    outPath,
    stderr,
    stdout,
  }
}

const decrypt = async (filePath: string, userPassword?: string) => {
  const {
    exitCode,
    stdout,
    stderr,
  } = await run([
    `decrypt`,
    ...(userPassword ? [`-upw`, userPassword] : []),
    filePath,
  ])
  if(exitCode === 1 || exitCode === 2){
    throw new Error(stderr.join(`\n`))
  }
  return {
    exitCode,
    stderr,
    stdout,
  }
}

const rotate = async (filePath: string, pageNumber: number, angle: number) => {
  const {
    exitCode,
    stdout,
    stderr,
  } = await run([
    `rotate`,
    `-p`,
    `${pageNumber}`,
    filePath,
    `${angle}`,
  ])
  if(exitCode === 1 || exitCode === 2){
    throw new Error(stderr.join(`\n`))
  }
  return {
    exitCode,
    stderr,
    stdout,
  }
}

const remove = async (filePath: string, pageNumber: number) => {
  const {
    exitCode,
    stdout,
    stderr,
  } = await run([
    `pages`,
    `remove`,
    `-p`,
    `${pageNumber}`,
    filePath,
  ])
  if(exitCode === 1 || exitCode === 2){
    throw new Error(stderr.join(`\n`))
  }
  return {
    exitCode,
    stderr,
    stdout,
  }
}

const collect = async (filePath: string, pageNumbers: number[]) => {
  const {
    exitCode,
    stdout,
    stderr,
  } = await run([
    `collect`,
    `-p`,
    `${pageNumbers.join(`,`)}`,
    filePath,
  ])
  if(exitCode === 1 || exitCode === 2){
    throw new Error(stderr.join(`\n`))
  }
  return {
    exitCode,
    stderr,
    stdout,
  }
}

const PdfCpu = {
  clearStd,
  collect,
  decrypt,
  getInfo,
  go,
  optimise,
  remove,
  rotate,
  run,
  setGo,
}

export default PdfCpu