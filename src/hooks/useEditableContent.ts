import { useCallback, useState } from 'react'
import { getRandomID } from 'utils/Utils'

const defaultBox: EditableBox = {
  id: ``,
  position: {
    x: 0,
    y: 0,
  },
  selected: false,
  size: {
    height: 100,
    width: 100,
  },
  type: `box`,
}

const useEditableContent = () => {
  const [editableContent, setEditableContent] = useState<EditableContent[]>([])

  const addBox = useCallback(() => {
    setEditableContent(c => [
      ...c,
      {
        ...defaultBox,
        id: getRandomID(),
      },
    ])
  }, [])

  return {
    addBox,
    editableContent,
  }
}

export default useEditableContent