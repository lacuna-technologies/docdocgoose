import { useCallback, useState, useEffect, useRef } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const usePdfViewerResize = ({ pageIndex }: { pageIndex: number }) => {
  const documentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [documentHeight, setDocumentHeight] = useState(500)
  const [documentWidth, setDocumentWidth] = useState(500)
  const [pageHeights, setPageHeights] = useState<number[]>([])
  const [pageWidths, setPageWidths] = useState<number[]>([])

  const getPageHeight = useCallback((pageIndex: number) => {
    return pageHeights[pageIndex] || 500
  }, [pageHeights])

  const getPageWidth = useCallback((pageIndex: number) => {
    return pageWidths[pageIndex] || 500
  }, [pageWidths])

  const setDocumentSize = useCallback(() => {
    if(documentRef !== null){
      setDocumentHeight(documentRef.current.clientHeight)
      setDocumentWidth(documentRef.current.clientWidth)
    }
  }, [documentRef])

  const setPageHeight = useCallback((pageIndex: number, height: number) => {
    setPageHeights(arr => ([
      ...arr.slice(0, pageIndex),
      height,
      ...arr.slice(pageIndex + 1),
    ]))
    setDocumentSize()
  }, [setDocumentSize])

  const setPageWidth = useCallback((pageIndex: number, width: number) => {
    setPageWidths(arr => ([
      ...arr.slice(0, pageIndex),
      width,
      ...arr.slice(pageIndex + 1),
    ]))
  }, [])

  const resizePage = useCallback(() => {
    const s = documentWidth / getPageWidth(pageIndex)
    setScale(s)
  }, [documentWidth, pageIndex, getPageWidth])

  const onResize = useCallback(() => {
    setDocumentSize()
    resizePage()
  }, [setDocumentSize, resizePage])

  const onDocumentLoad = useCallback((pdf: PDFDocumentProxy) => {
    setPageHeights(Array.from({ length: pdf.numPages }, () => 500))
    setPageWidths(Array.from({ length: pdf.numPages }, () => 500))
    onResize()
  }, [onResize])

  useEffect(() => {
    resizePage()
  }, [documentWidth, resizePage])
  
  useEffect(() => {
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [onResize])

  return {
    documentHeight,
    documentRef,
    documentWidth,
    getPageHeight,
    onDocumentLoad,
    pageHeights,
    scale,
    setPageHeight,
    setPageWidth,
  }
}

export default usePdfViewerResize