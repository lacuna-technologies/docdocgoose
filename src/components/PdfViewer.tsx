import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { File } from 'utils/Storage'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer'
import type { PDFPageProxy } from 'react-pdf'

interface Props {
  file: File,
  className?: string,
  pageClassName?: string,
  loadingComponent?: React.ReactElement,
}

const PdfViewer: React.FC<Props> = ({
  file,
  className = ``,
  pageClassName = ``,
  loadingComponent,
}) => {
  const pageDiv = useRef(null)
  const [scale, setScale] = useState(1)
  const [pageWidth, setPageWidth] = useState(null)
  const resizePage = useCallback((width: number) => {
    if(pageDiv !== null && Number.isInteger(width)){
      const s = pageDiv.current.clientWidth / width
      setScale(s)
    }
  }, [])
  const onPageLoad = useCallback((page: PDFPageProxy) => {
    setPageWidth(page.originalWidth)
    resizePage(page.originalWidth)
  }, [resizePage])
  const onResize = useCallback((event: Event) => {
    resizePage(pageWidth)
  }, [resizePage, pageWidth])
  useEffect(() => {
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [onResize])
  
  return (
    <Document
      file={file}
      className={className}
      renderMode="svg"
      loading={loadingComponent}
    >
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