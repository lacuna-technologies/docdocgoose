import { useCallback, useState } from 'react'

const usePdfViewerPage = () => {
  const [numPages, setNumPages] = useState(null as number)
  const [pageNumber, setPageNumber] = useState(1)

  const gotoPage = useCallback((num) => {
    setPageNumber(num)
  }, [])

  const onDocumentLoad = useCallback((doc) => {
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