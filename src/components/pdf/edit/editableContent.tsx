import React from 'react'
import { Rnd } from 'react-rnd'
import type { Props as RndProps } from 'react-rnd'

type Props = {
  bounds?: RndProps[`bounds`],
  editableContent: EditableContent[],
}

const EditableContent: React.FC<Props> = ({ bounds, editableContent }) => {
  return (
    <>
      {
        editableContent.map(({ id, type, size, position }) => {
          if(type === `box`){
            return (
              <Rnd
                key={id}
                className="bg-white border border-black z-10"
                bounds={bounds}
                size={size}
                position={position}
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