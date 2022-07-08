import React from 'react'
import { useDropzone } from 'react-dropzone'
import type { DropzoneOptions } from 'react-dropzone'
import { ContentTypes } from 'utils/Constants'

interface Props {
  onDrop: DropzoneOptions[`onDrop`],
  className?: string,
}

const DropZone: React.FC<Props> = ({ onDrop, className = `` }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      [ContentTypes.pdf]: [`.pdf`],
      // 'application/msword': [`.doc`],
      [ContentTypes.docx]: [`.docx`],
      // TODO: xlsx & pptx
    },
    maxFiles: 1,
    onDrop,
  })

  return (
    <div className={`flex flex-col justify-center items-center p-4 text-center bg-slate-300 cursor-pointer border-2 border-dotted border-slate-400 outline-none ${className}`} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive
        ? (
          <p>Drop your file here</p>
        )
        : (
          <>
            <div className="md:block hidden">
              <p>Drop your .pdf or .docx file here</p>
              <p className="text-sm">(or click to select a file from your computer)</p>
            </div>
            <div className="md:hidden block">
              <p>Tap here to select a .pdf or .docx file</p>
            </div>
          </>
        )
      }
    </div>
  )
}

export default DropZone