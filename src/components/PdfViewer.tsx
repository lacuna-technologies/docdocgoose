import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { File } from 'utils/Storage'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer'

interface Props {
  file: File,
  className?: string,
  pageClassName?: string,
}

const PdfViewer: React.FC<Props> = ({
  file,
  className = ``,
  pageClassName = ``,
}) => {
  const pageDiv = useRef(null)
  const [scale, setScale] = useState(1)
  const [pageWidth, setPageWidth] = useState(null)
  const resizePage = useCallback((width: number) => {
    if(pageDiv !== null && Number.isInteger(width)){
      const s = pageDiv.current.clientWidth / width
      console.log(`width`, width)
      console.log(`clientWidth`, pageDiv.current.clientWidth)
      console.log(`scale`, s)
      setScale(s)
    }
  }, [])
  const onPageLoad = useCallback((page) => {
    setPageWidth(page.originalWidth)
    resizePage(page.originalWidth)
  }, [resizePage])
  const onResize = useCallback((event?: Event) => {
    resizePage(pageWidth)
  }, [resizePage, pageWidth])
  useEffect(() => {
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [onResize])
  
  return (
    <Document file={file} className={className} renderMode="svg">
      <Page
        pageNumber={1}
        className={pageClassName}
        inputRef={pageDiv}
        onLoadSuccess={onPageLoad}
        scale={scale}
      />
    </Document>
  )
}

export default PdfViewer