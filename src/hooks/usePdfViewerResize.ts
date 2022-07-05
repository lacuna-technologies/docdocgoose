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
      console.log(`setting document size`, documentRef.current.clientHeight, documentRef.current.clientWidth)
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
    setDocumentSize()
  }, [setDocumentSize])

  const resizePage = useCallback(() => {
    const s = documentWidth / getPageWidth(pageNumber)
    setScale(s)
  }, [documentWidth, pageNumber, getPageWidth])

  const onDocumentLoad = useCallback((pdf: PDFDocumentProxy) => {
    setPageHeights(Array.from({ length: pdf.numPages }, () => 500))
    setPageWidths(Array.from({ length: pdf.numPages }, () => 500))
    // window.resizeBy(0, 0) // trigger the resize event
  }, [])

  const onResize = useCallback((event: Event) => {
    setDocumentSize()
    // resizePage()
  }, [setDocumentSize])
  
  useEffect(() => {
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [onResize])

  console.log(documentHeight, documentWidth, pageWidths, pageHeights)

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