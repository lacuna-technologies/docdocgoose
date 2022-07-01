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
          setFileInfo(result)
        } catch (error){
          if(error.message === `File is encrypted`){
            setFileInfo({
              encrypted: true,
            })
          } else {
            console.error(error)
            setError(`Something went wrong when processing your file`)
          }
        } finally {
          setFileLoaded(true)
        }
      })
    })()
  }, [router, file, fileLoaded, wasmLoaded])

  return {
    error,
    fileInfo,
    fileLoaded,
  }
}

export default useFileInfo