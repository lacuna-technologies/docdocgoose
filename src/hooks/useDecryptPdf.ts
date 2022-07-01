import { useCallback, useState } from "react"
import PdfCpu from 'utils/PdfCpu'
import type { File } from 'utils/Storage'

interface DecryptedResult {
  url: string,
  fileName: string,
}

const useDecryptPdf = ({ file }: { file: File }) => {
  const [decrypting, setDecrypting] = useState(false)
  const [decryptedResult, setDecryptedResult] = useState(null as DecryptedResult)
  const decryptPdf = useCallback(async () => {
    setDecrypting(true)
    const arrayBuffer = await file.arrayBuffer()
    globalThis.fs.writeFileSync(`/${file.path}`, Buffer.from(arrayBuffer))
    try {
      const { outPath } = await PdfCpu.decrypt(`/${file.path}`)
      const outBuffer = globalThis.fs.readFileSync(outPath)
      const blob = new Blob([outBuffer])
      setDecryptedResult({
        fileName: outPath.slice(1),
        url: URL.createObjectURL(blob),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setDecrypting(false)
    }
  }, [file])

  return {
    decryptPdf,
    decryptedResult,
    decrypting,
  }
}

export default useDecryptPdf