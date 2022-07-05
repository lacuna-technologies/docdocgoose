import { useCallback, useEffect } from 'react'

const usePdfViewerScroll = ({ documentRef }: { documentRef: React.MutableRefObject<HTMLDivElement> }) => {
  const onScroll = useCallback(() => {

  }, [])
  
  useEffect(() => {
    if(documentRef !== null){
      documentRef.current.addEventListener(`scroll`, onScroll)
      return () => {
        documentRef.current.removeEventListener(`scroll`, onScroll)
      }
    }
  }, [documentRef])
}

export default usePdfViewerScroll