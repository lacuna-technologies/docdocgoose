import React, { useCallback } from 'react'
import { DraggableData, Rnd } from 'react-rnd'
import type { Props as RndProps } from 'react-rnd'

const Dot = () => (
  <div className="mt-1 ml-1 w-2 h-2 rounded-full bg-slate-400" />
)

type Props = EditableBox & {
  bounds: RndProps[`bounds`],
  updateBoxSize: (id: EditableObject[`id`], { width, height }: EditableBox[`size`]) => void,
  updateBoxPosition: (id: EditableObject[`id`], { x, y }: EditableBox[`position`]) => void,
}

const EditableBox: React.FC<Props> = ({
  id,
  bounds,
  size,
  position,
  updateBoxSize,
  updateBoxPosition,
  selected,
}) => {
  const onResizeStop = useCallback((_, __, ref: React.ElementRef<`div`>) => {
    const { offsetWidth: width, offsetHeight: height } = ref
    updateBoxSize(id, { height, width })
  }, [id, updateBoxSize])
  const onDragStop = useCallback((_, data: DraggableData) => {
    const { x, y } = data
    updateBoxPosition(id, { x, y })
  }, [id, updateBoxPosition])

  return (
    <Rnd
      className={`bg-white border border-slate-400 z-10 ${selected ? `border-dashed` : `border-none`}`}
      bounds={bounds}
      size={size}
      position={position}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      resizeHandleComponent={selected ? {
        bottomLeft: <Dot />,
        bottomRight: <Dot />,
        topLeft: <Dot />,
        topRight: <Dot />,
      } : undefined}
    />
  )
}

export default EditableBox