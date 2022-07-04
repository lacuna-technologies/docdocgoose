import React, { useState, useCallback } from 'react'
import type { FileInfo } from 'utils/PdfCpu'

const FileInfoDetails = (
  { className, fileInfo }:
  { className: string, fileInfo: FileInfo }
) => {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])
  return (
    <div className={className}>
      <a className="cursor-pointer" onClick={toggleExpanded}>
        <small>({expanded ? `hide` : `show`} more details)</small>
      </a>
      <pre className={`mt-2 text-sm overflow-x-scroll ${expanded ? `` : `hidden`}`}>
        {JSON.stringify(fileInfo, null, 2)}
      </pre>
    </div>
  )
}

export default FileInfoDetails