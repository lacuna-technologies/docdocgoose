import { useCallback, useState } from 'react'
import PdfCpu from 'utils/PdfCpu'
import { downloadBlob } from 'utils/Utils'

const useEditPdf = (
  {
    file,
    rotations,
  }:
  {
    file: File,
    rotations: number[],
  }
) => {
  const [editing, setEditing] = useState(false)

  const saveFile = useCallback(async () => {
    setEditing(true)
    const arrayBuffer = await file.arrayBuffer()
    const filePath = `/${file.name}`
    globalThis.fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
    try {
      // TODO: run page re-orgs and deletions too
      for(const [index, angle] of rotations.entries()){
        const pageNumber = index + 1
        if(angle !== 0){
          await PdfCpu.rotate(filePath, pageNumber, angle)
        }
      }
      const outBuffer = globalThis.fs.readFileSync(filePath)
      const blob = new Blob([outBuffer])
      downloadBlob(blob, filePath.slice(1).replace(/\.pdf$/, `-edited.pdf`))
    } catch (error){
      console.error(error)
    } finally {
      setEditing(false)
    }
  }, [file, rotations])

  return {
    editing,
    saveFile,
  }
}

export default useEditPdf