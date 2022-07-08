import { useCallback, useState } from "react"
import Logger from "utils/Logger"
import PdfCpu from 'utils/PdfCpu'
import Storage from 'utils/Storage'

interface DecryptedResult {
  url: string,
  fileName: string,
}

const useDecryptPdf = ({ file, reloadFile }: { file: File, reloadFile: () => void }) => {
  const [decrypting, setDecrypting] = useState(false)
  const [decryptedResult, setDecryptedResult] = useState(null as DecryptedResult)
  const decryptPdf = useCallback(async () => {
    setDecrypting(true)
    const arrayBuffer = await file.arrayBuffer()
    const filePath = `/${file.name}`
    globalThis.fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
    try {
      await PdfCpu.decrypt(filePath)
      const outBuffer: Buffer = globalThis.fs.readFileSync(filePath)
      const blob = new Blob([outBuffer])
      const f = new File([outBuffer], file.name)
      Storage.setFile(f)
      setDecryptedResult({
        fileName: file.name,
        url: URL.createObjectURL(blob),
      })
      reloadFile()
    } catch (error) {
      Logger.error(error)
    } finally {
      setDecrypting(false)
    }
  }, [file, reloadFile])

  return {
    decryptPdf,
    decryptedResult,
    decrypting,
  }
}

export default useDecryptPdf