import { useCallback, useState } from 'react'
import PdfCpu from 'utils/PdfCpu'
import Storage from 'utils/Storage'
import { downloadBlob } from 'utils/Utils'

const useEditPdf = (
  {
    file,
    pageOrder,
  }:
  {
    file: File,
    pageOrder: PageInfo[],
  }
) => {
  const [editing, setEditing] = useState(false)

  const saveFile = useCallback(async () => {
    setEditing(true)
    const arrayBuffer = await file.arrayBuffer()
    const filePath = `/${file.name}`
    globalThis.fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
    try {
      await PdfCpu.collect(filePath, pageOrder.map(({ pageNumber }) => pageNumber))

      for(const [index, { rotation }] of pageOrder.entries()){
        const pageNumber = index + 1
        if(rotation !== 0){
          await PdfCpu.rotate(filePath, pageNumber, rotation)
        }
      }
      const outBuffer: Buffer = globalThis.fs.readFileSync(filePath)
      const blob = new Blob([outBuffer])
      const f = new File([outBuffer], file.name)
      Storage.setFile(f)
      downloadBlob(blob, filePath.slice(1).replace(/\.pdf$/, `-edited.pdf`))
    } catch (error){
      console.error(error)
    } finally {
      setEditing(false)
    }
  }, [file, pageOrder])

  return {
    editing,
    saveFile,
  }
}

export default useEditPdf