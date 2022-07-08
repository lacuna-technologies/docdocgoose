import { useState, useEffect, useCallback } from "react"
import Logger from "utils/Logger"
import MSWord from 'utils/MSWord'
import Storage from "utils/Storage"
import { downloadBlob } from "utils/Utils"

export type DocStates = `loading` | `encrypted` |
  `edit-protected` | `edit-protected-loading` |
  `locked-track-changes` | `locked-track-changes-loading` |
  `unrestricted`

const useDocInfo = ({ file }: { file: File }) => {
  const [status, setStatus] = useState<DocStates>(`loading`)
  const [loaded, setLoaded] = useState(false)

  const removeEditProtection = useCallback(async () => {
    setStatus(`edit-protected-loading`)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const newFile = await MSWord.removeEditProtection(arrayBuffer)
      Storage.setFile(new File([newFile], file.name))
      setLoaded(false)
    } catch(error) {
      Logger.error(error)
      return setStatus(`edit-protected`)
    }
  }, [file])

  const unlockTrackChanges = useCallback(async () => {
    setStatus(`locked-track-changes-loading`)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const newFile = await MSWord.unlockTrackChanges(arrayBuffer)
      Storage.setFile(new File([newFile], file.name))
      setLoaded(false)
    } catch (error) {
      Logger.error(error)
      return setStatus(`locked-track-changes`)
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
          const isTrackChangesLocked = await MSWord.isTrackChangesLocked(arrayBuffer)
          if(isTrackChangesLocked){
            return setStatus(`locked-track-changes`)
          }
          return setStatus(`unrestricted`)
        } catch (error){
          Logger.error(error)
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
    unlockTrackChanges,
  }
}

export default useDocInfo