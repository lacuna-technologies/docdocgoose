import React from 'react'
import type { Props as RndProps } from 'react-rnd'
import EditableBox from './EditableBox'

type Props = {
  bounds?: RndProps[`bounds`],
  editableContent: EditableContent[],
  updateBoxSize: (id: EditableObject[`id`], { width, height }: EditableBox[`size`]) => void,
  updateBoxPosition: (id: EditableObject[`id`], { x, y }: EditableBox[`position`]) => void,
}

const EditableContent: React.FC<Props> = ({
  bounds,
  editableContent,
  updateBoxSize,
  updateBoxPosition,
}) => {

  return (
    <>
      {
        editableContent.map((data) => {
          const { id, type } = data
          if(type === `box`){
            return (
              <EditableBox
                {...data}
                key={id}
                bounds={bounds}
                updateBoxPosition={updateBoxPosition}
                updateBoxSize={updateBoxSize}
              />
            )
          }
          return null
        })
      }
    </>
  )
}

export default EditableContent