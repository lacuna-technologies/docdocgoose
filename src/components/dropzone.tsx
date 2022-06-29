import React from 'react'

const DropZone = () => {
  return (
    <div className="flex flex-col justify-center items-center p-4 text-center bg-slate-300 cursor-pointer">
      <p>Drop your file here</p>
      <p className="text-sm">(or click to select a file from your computer)</p>
    </div>
  )
}

export default DropZone