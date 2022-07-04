import { useRef, useCallback, useState, useEffect } from 'react'
import type { PDFPageProxy } from 'react-pdf'

const usePdfViewerResize = () => {

  const pageDiv = useRef(null)
  const [scale, setScale] = useState(1)
  const [pageWidth, setPageWidth] = useState(null)

  const resizePage = useCallback((width: number) => {
    if(pageDiv !== null && Number.isInteger(width)){
      const s = pageDiv.current.clientWidth / width
      setScale(s)
    }
  }, [])

  const onPageLoad = useCallback((page: PDFPageProxy) => {
    setPageWidth(page.originalWidth)
    resizePage(page.originalWidth)
  }, [resizePage])

  const onResize = useCallback((event: Event) => {
    resizePage(pageWidth)
  }, [resizePage, pageWidth])
  
  useEffect(() => {
    window.addEventListener(`resize`, onResize)
    return () => {
      window.removeEventListener(`resize`, onResize)
    }
  }, [onResize])

  return {
    onPageLoad,
    pageDiv,
    scale,
  }
}

export default usePdfViewerResize