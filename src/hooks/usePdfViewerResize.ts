import { useCallback, useState, useEffect, useRef } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const usePdfViewerResize = ({ pageNumber }: { pageNumber: number }) => {
  const documentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [documentHeight, setDocumentHeight] = useState(500)
  const [documentWidth, setDocumentWidth] = useState(500)
  const [pageHeights, setPageHeights] = useState<number[]>([])
  const [pageWidths, setPageWidths] = useState<number[]>([])

  const getPageHeight = useCallback((pageNumber: number) => {
    return pageHeights[pageNumber - 1] || 500
  }, [pageHeights])

  const getPageWidth = useCallback((pageNumber: number) => {
    return pageWidths[pageNumber - 1] || 500
  }, [pageWidths])

  const setDocumentSize = useCallback(() => {
    if(documentRef !== null){
      setDocumentHeight(documentRef.current.clientHeight)
      setDocumentWidth(documentRef.current.clientWidth)
    }
  }, [documentRef])

  const setPageHeight = useCallback((pageNumber: number, height: number) => {
    setPageHeights(arr => ([
      ...arr.slice(0, pageNumber - 1),
      height,
      ...arr.slice(pageNumber),
    ]))
    setDocumentSize()
  }, [setDocumentSize])

  const setPageWidth = useCallback((pageNumber: number, width: number) => {
    setPageWidths(arr => ([
      ...arr.slice(0, pageNumber - 1),
      width,
      ...arr.slice(pageNumber),
    ]))
  }, [])

  const resizePage = useCallback(() => {
    const s = documentWidth / getPageWidth(pageNumber)
    setScale(s)
  }, [documentWidth, pageNumber, getPageWidth])

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
    scale,
    setPageHeight,
    setPageWidth,
  }
}

export default usePdfViewerResize