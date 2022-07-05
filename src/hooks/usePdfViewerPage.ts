import { useCallback, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const usePdfViewerPage = () => {
  const [numPages, setNumPages] = useState(null as number)
  const [pageNumber, setPageNumber] = useState(1)

  const gotoPage = useCallback((num) => {
    setPageNumber(num)
  }, [])

  const onDocumentLoad = useCallback((doc: PDFDocumentProxy) => {
    setNumPages(doc.numPages)
  }, [setNumPages])

  return {
    gotoPage,
    numPages,
    onDocumentLoad,
    pageNumber,
    setNumPages,
  }
}

export default usePdfViewerPage