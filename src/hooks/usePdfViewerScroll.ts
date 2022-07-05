import { useCallback, useEffect } from 'react'

const usePdfViewerScroll = ({ documentRef }: { documentRef: React.MutableRefObject<HTMLDivElement> }) => {
  const onScroll = useCallback((event: HTMLElementEventMap[`scroll`]) => {
    const element = event.currentTarget as HTMLDivElement
    console.log(`height`, element.clientHeight)
    console.log(`scrollTop`, element.scrollTop)
    console.log(`scrollHeight`, element.scrollHeight)
  }, [])
  
  useEffect(() => {
    if(documentRef !== null){
      const ref = documentRef.current
      ref.addEventListener(`scroll`, onScroll)
      return () => {
        ref.removeEventListener(`scroll`, onScroll)
      }
    }
  }, [documentRef, onScroll])
}

export default usePdfViewerScroll