import { useCallback, useState } from 'react'
import type { DraggableData } from 'react-rnd'
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

  const updateBoxSize = useCallback((id: EditableObject[`id`], { width, height }: EditableBox[`size`]) => {
    setEditableContent(c => c.map(box => (box.id === id ? { ...box, size: { ...box.size, height, width } } : box)))
  }, [])
  
  const updateBoxPosition = useCallback((id: EditableObject[`id`], { x, y }: DraggableData) => {
    setEditableContent(c => c.map(box => (box.id === id ? { ...box, position: { x, y } } : box)))
  }, [])

  const selectBox = useCallback((id: EditableObject[`id`]) => {
    setEditableContent(c => c.map(box => (box.id === id ? { ...box, selected: true } : box)))
  }, [])

  return {
    addBox,
    editableContent,
    selectBox,
    updateBoxPosition,
    updateBoxSize,
  }
}

export default useEditableContent