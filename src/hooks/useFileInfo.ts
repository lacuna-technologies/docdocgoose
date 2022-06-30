import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { FileInfo } from 'utils/PdfCpu'
import PdfCpu from 'utils/PdfCpu'

const useFileInfo = ({ file, wasmLoaded }) => {
  const router = useRouter()

  const [fileLoaded, setFileLoaded] = useState(false)
  const [error, setError] = useState(null as string)
  const [fileInfo, setFileInfo] = useState({} as FileInfo)

  useEffect(() => {
    if(fileLoaded){ // only run once
      return
    }
    if(typeof file === `undefined`){
      router.push(`/`)
    }
    if(wasmLoaded && PdfCpu.go === null){
      console.debug(`go is not yet defined`)
      return
    }
    (async () => {
      const arrayBuffer = await file.arrayBuffer()
      globalThis.fs.writeFile(`/${file.path}`, Buffer.from(arrayBuffer), async (err: any) => {
        if(err){
          throw err
        }
        try {
          const result = await PdfCpu.getInfo(`/${file.path}`)
          setFileLoaded(true)
          setFileInfo(result)
        } catch (error){
          console.error(error)
          setError(`Something went wrong when processing your file`)
        }
      })
    })()
  }, [file, fileLoaded, wasmLoaded])

  return {
    fileLoaded,
    error,
    fileInfo
  }
}

export default useFileInfo