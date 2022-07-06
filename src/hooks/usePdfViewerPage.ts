import { useCallback, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const usePdfViewerPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageOrder, setPageOrder] = useState<PageInfo[]>([]) // array of page numbers

  const setCurrentPage = useCallback((index: number) => {
    setPageIndex(index)
  }, [])

  const onDocumentLoad = useCallback((doc: PDFDocumentProxy) => {
    setPageOrder(Array.apply(null, Array(doc.numPages)).map(
      (_, i) => ({ pageNumber: i + 1, rotation: 0 })
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

  const rotatePage = useCallback((pageIndex: number) => {
    if(pageOrder.length > 0){
      setPageOrder(array => {
        return [
          ...array.slice(0, pageIndex),
          {
            ...array[pageIndex],
            rotation: (array[pageIndex].rotation + 90) % 360,
          },
          ...array.slice(pageIndex + 1),
        ]
      })
    }
  }, [pageOrder.length])

  const getRotation = useCallback((pageIndex: number) => {
    return pageOrder[pageIndex]?.rotation || 0
  }, [pageOrder])

  return {
    getRotation,
    onDocumentLoad,
    pageIndex,
    pageOrder,
    removeCurrentPage,
    rotatePage,
    setCurrentPage,
  }
}

export default usePdfViewerPage