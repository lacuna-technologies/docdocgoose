import { useCallback, useState } from 'react'

const usePdfViewerPage = () => {
  const [numPages, setNumPages] = useState(null as number)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoad = useCallback((doc) => {
    setNumPages(doc.numPages)
  }, [])

  const gotoPage = useCallback((pageNumber) => {
    setPageNumber(pageNumber)
  }, [])

  return {
    gotoPage,
    numPages,
    onDocumentLoad,
    pageNumber,
  }
}

export default usePdfViewerPage