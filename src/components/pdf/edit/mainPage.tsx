import React, { useCallback } from 'react'
import { Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { PDFPageProxy } from 'react-pdf'

type Props = {
  pageIndex: number,
  scale: number,
  rotation: number,
  setPage: (pageIndex: number, action: (p: PageInfo) => PageInfo) => void,
  onLoadSuccess?: (page: PDFPageProxy) => void,
}

const MainPage: React.FC<Props> = ({ pageIndex, scale, rotation, setPage, onLoadSuccess }) => {
  const onRenderSuccess = useCallback((page: PDFPageProxy) => {
    setPage(pageIndex, (p) => ({
      ...p,
      height: page.height,
      originalHeight: page.originalHeight,
      originalWidth: page.originalWidth,
      width: page.width,
    }))
  }, [setPage, pageIndex])
  return (
    <Page
      pageIndex={pageIndex}
      scale={scale}
      rotate={rotation}
      onLoadSuccess={onLoadSuccess}
      onRenderSuccess={onRenderSuccess}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  )
}

export default MainPage