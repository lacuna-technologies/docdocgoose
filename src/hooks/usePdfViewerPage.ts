import { useCallback, useState, useEffect, useRef } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const DEFAULT_PAGE_WIDTH = 500
const DEFAULT_PAGE_HEIGHT = 500

const usePdfViewerPage = () => {
  const documentRef = useRef(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageOrder, setPageOrder] = useState<PageInfo[]>([]) // array of page numbers
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

  const zoomFullWidth = useCallback((pageWidth?: number) => {
    if(documentRef && documentRef?.current){
      const documentWidth = documentRef.current.clientWidth
      const pWidth = (typeof pageWidth === `number`) ? pageWidth : pageOrder[pageIndex].originalWidth
      const s = documentWidth / pWidth
      setScale(s)
    }
  }, [pageOrder, pageIndex])

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
    setPage(pageIndex, p => {
      const rotation = (p.rotation + 90) % 360
      return {
        ...p,
        rotation,
      }
    })
  }, [setPage])

  const getRotation = useCallback((pageIndex: number) => {
    return pageOrder[pageIndex]?.rotation || 0
  }, [pageOrder])

  useEffect(() => {
    const onResize = () => { zoomFullWidth() }
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [zoomFullWidth])

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
    zoomFullWidth,
  }
}

export default usePdfViewerPage