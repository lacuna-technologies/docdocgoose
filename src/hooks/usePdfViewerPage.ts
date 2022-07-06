import { useCallback, useState, useEffect, useRef, SetStateAction } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const DEFAULT_PAGE_WIDTH = 500
const DEFAULT_PAGE_HEIGHT = 500

const usePdfViewerPage = () => {
  const documentRef = useRef(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageOrder, setPageOrder] = useState<PageInfo[]>([]) // array of page numbers
  const [documentHeight, setDocumentHeight] = useState(DEFAULT_PAGE_HEIGHT)
  const [documentWidth, setDocumentWidth] = useState(DEFAULT_PAGE_WIDTH)
  const [scale, setScale] = useState(1)

  const setCurrentPage = useCallback((index: number) => {
    setPageIndex(index)
  }, [])

  const onDocumentLoad = useCallback((doc: PDFDocumentProxy) => {
    setPageOrder(Array.apply(null, Array(doc.numPages)).map(
      (_, i) => ({
        height: DEFAULT_PAGE_HEIGHT,
        originalHeight: DEFAULT_PAGE_HEIGHT,
        originalWidth: DEFAULT_PAGE_WIDTH,
        pageNumber: i + 1,
        rotation: 0,
        width: DEFAULT_PAGE_WIDTH,
      })
    ))
  }, [])

  const removePage = useCallback((index: number) => {
    if(index === pageIndex){
      const prevIndex = (index - 1)
      const newIndex = prevIndex >= 0 ? prevIndex : 0
      setPageIndex(newIndex)
    }
    setPageOrder([
      ...pageOrder.slice(0, index),
      ...pageOrder.slice(index + 1),
    ])
  }, [pageIndex, pageOrder])

  const removeCurrentPage = useCallback(() => {
    removePage(pageIndex)
  }, [pageIndex, removePage])

  const setPage = useCallback((pageIndex: number, action: (p: PageInfo) => PageInfo) => {
    setPageOrder(arr => ([
      ...arr.slice(0, pageIndex),
      action(arr[pageIndex]),
      ...arr.slice(pageIndex + 1),
    ]))
  }, [])

  const rotatePage = useCallback((pageIndex: number) => {
    setPage(pageIndex, p => ({
      ...p,
      rotation: (p.rotation + 90) % 360,
    }))
  }, [setPage])

  const getRotation = useCallback((pageIndex: number) => {
    return pageOrder[pageIndex]?.rotation || 0
  }, [pageOrder])

  const setDocumentSize = useCallback(() => {
    if(documentRef !== null){
      setDocumentHeight(documentRef.current.clientHeight)
      setDocumentWidth(documentRef.current.clientWidth)
    }
  }, [documentRef])

  const onResize = useCallback(() => {
    setDocumentSize()
    // resize page
  }, [setDocumentSize])

  useEffect(() => {
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [onResize])

  return {
    documentRef,
    getRotation,
    onDocumentLoad,
    pageIndex,
    pageOrder,
    removeCurrentPage,
    rotatePage,
    scale,
    setCurrentPage,
    setPage,
  }
}

export default usePdfViewerPage