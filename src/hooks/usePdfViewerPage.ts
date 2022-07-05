import { useCallback, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const usePdfViewerPage = () => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageOrder, setPageOrder] = useState<number[]>([]) // array of page numbers

  const setCurrentPage = useCallback((index: number) => {
    setPageIndex(index)
  }, [])

  const onDocumentLoad = useCallback((doc: PDFDocumentProxy) => {
    setNumPages(doc.numPages)
    setPageOrder(Array.apply(null, Array(doc.numPages)).map((_, i) => i + 1))
  }, [setNumPages])

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

  return {
    numPages,
    onDocumentLoad,
    pageIndex,
    pageOrder,
    removeCurrentPage,
    setCurrentPage,
    setNumPages,
  }
}

export default usePdfViewerPage