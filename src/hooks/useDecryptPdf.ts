import { useCallback, useState } from "react"
import Logger from "utils/Logger"
import PdfCpu, { EncryptedPDFError, InvalidPDFError } from 'utils/PdfCpu'
import Storage from 'utils/Storage'

const useDecryptPdf = (
  { file, fileInfo, reloadFile }:
  { file: File, fileInfo: FileInfo, reloadFile: () => void }
) => {
  const [decrypting, setDecrypting] = useState(false)
  const [decryptResult, setDecryptResult] = useState(null as ProcessFileResult)
  const [error, setError] = useState<string>(``)

  const decryptPdf = useCallback(async () => {
    setDecrypting(true)
    const arrayBuffer = await file.arrayBuffer()
    const filePath = `/${file.name}`
    globalThis.fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
    let password
    if(fileInfo.encrypted){
      password = window.prompt(`This PDF is encrypted with a password. Please enter the password to decrypt it: `)
    }
    try {
      await PdfCpu.decrypt(filePath, password)
    } catch (error) {
      setDecrypting(false)
      Logger.error(`decryptPdf`, error)
      if (error instanceof EncryptedPDFError) {
        return setError(`The password was incorrect or the PDF is invalid.`)
      } else if(error instanceof InvalidPDFError) {
        return setError(error.message)
      } else {
        return setError(`Sorry, something went wrong when processing the PDF`)
      }
    }

    const outBuffer: Buffer = globalThis.fs.readFileSync(filePath)
    const blob = new Blob([outBuffer])
    const f = new File([outBuffer], file.name)
    Storage.setFile(f)
    setDecryptResult({
      fileName: file.name,
      url: URL.createObjectURL(blob),
    })
    reloadFile()
  }, [file, reloadFile, fileInfo])

  return {
    decryptPdf,
    decryptResult,
    decrypting,
    error,
  }
}

export default useDecryptPdf