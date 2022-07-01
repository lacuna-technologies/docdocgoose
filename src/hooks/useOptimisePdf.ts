import { useCallback, useState } from "react"
import PdfCpu from 'utils/PdfCpu'
import type { File } from 'utils/Storage'

interface OptimisedResult {
  size: number,
  url: string,
  fileName: string,
}

const useOptimisePdf = ({ file }: { file: File }) => {
  const [optimising, setOptimising] = useState(false)
  const [optimisedResult, setOptimisedResult] = useState(null as OptimisedResult)
  const optimisePdf = useCallback(async () => {
    setOptimising(true)
    const arrayBuffer = await file.arrayBuffer()
    globalThis.fs.writeFileSync(`/${file.path}`, Buffer.from(arrayBuffer))
    try {
      const { outPath } = await PdfCpu.optimise(`/${file.path}`)
      const outBuffer = globalThis.fs.readFileSync(outPath)
      const blob = new Blob([outBuffer])
      setOptimisedResult({
        size: blob.size,
        url: URL.createObjectURL(blob),
        fileName: outPath.slice(1)
      })
    } catch (error){
      console.error(error)
    } finally {
      setOptimising(false)
    }
  }, [file])

  return {
    optimisedResult,
    optimisePdf,
    optimising,
  }
}

export default useOptimisePdf