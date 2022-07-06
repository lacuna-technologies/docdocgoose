import React, { SetStateAction, useCallback } from 'react'
import { Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { PDFPageProxy } from 'react-pdf'

type Props = {
  pageIndex: number,
  scale: number,
  rotation: number,
  setPage: (pageIndex: number, action: (p: PageInfo) => PageInfo) => void
}

const MainPage: React.FC<Props> = ({ pageIndex, scale, rotation, setPage }) => {
  const onLoadSuccess = useCallback((page: PDFPageProxy) => {
    setPage(pageIndex, (p) => ({
      ...p,
      height: page.height,
      originalHeight: page.originalHeight,
      originalWidth: page.originalWidth,
      width: page.width,
    }))
  }, [setPage, pageIndex])
  const pageNumber = pageIndex + 1
  return (
    <Page
      pageNumber={pageNumber}
      scale={scale}
      rotate={rotation}
      onLoadSuccess={onLoadSuccess}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  )
}

export default MainPage