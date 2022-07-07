import { useState, useEffect, useCallback } from "react"
import MSWord from 'utils/MSWord'
import Storage from "utils/Storage"
import { downloadBlob } from "utils/Utils"

export type DocStates = `loading` | `encrypted` |
  `edit-protected` | `edit-protected-loading` |
  `locked-track-changes` | `unrestricted`

const useDocInfo = ({ file }: { file: File }) => {
  const [status, setStatus] = useState<DocStates>(`loading`)
  const [loaded, setLoaded] = useState(false)

  const removeEditProtection = useCallback(async () => {
    setStatus(`edit-protected-loading`)
    const arrayBuffer = await file.arrayBuffer()
    try {
      const newFile = await MSWord.removeEditProtection(arrayBuffer)
      Storage.setFile(new File([newFile], file.name))
      setLoaded(false)
    } catch(error) {
      console.error(error)
      return setStatus(`edit-protected`)
    }
  }, [file])

  const saveFile = useCallback(async () => {
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer])
    downloadBlob(blob, file.name)
  }, [file])

  useEffect(() => {
    if(!loaded){
      (async () => {
        const arrayBuffer = await file.arrayBuffer()
        try {
          const isEditProtected = await MSWord.isEditProtected(arrayBuffer)
          if(isEditProtected){
            return setStatus(`edit-protected`)
          }
          return setStatus(`unrestricted`)
        } catch (error){
          console.error(error)
          setStatus(`encrypted`)
        } finally {
          setLoaded(true)
        }
      })()
    }
  }, [file, loaded])

  return {
    removeEditProtection,
    saveFile,
    status,
  }
}

export default useDocInfo