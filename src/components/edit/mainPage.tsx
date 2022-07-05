import React, { useCallback } from 'react'
import { Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { PDFPageProxy } from 'react-pdf'

type Props = {
  pageIndex: number,
  scale: number,
  rotation: number,
  setPageHeight: (n: number, h: number) => void,
  setPageWidth: (n: number, w: number) => void,
}

const MainPage: React.FC<Props> = ({ pageIndex, scale, rotation, setPageHeight, setPageWidth }) => {
  const onLoadSuccess = useCallback((page: PDFPageProxy) => {
    setPageHeight(pageIndex, page.originalHeight)
    setPageWidth(pageIndex, page.originalWidth)
  }, [setPageHeight, setPageWidth, pageIndex])
  const pageNumber = pageIndex + 1
  return (
    <Page
      pageNumber={pageNumber}
      scale={scale}
      rotate={rotation}
      onLoadSuccess={onLoadSuccess}
    />
  )
}

export default MainPage