import { useCallback, useEffect } from 'react'
import { debounce } from 'utils/Utils'

// https://github.com/michaeldzjap/react-pdf-sample/tree/master/src
// https://github.com/bvaughn/react-window

const usePdfViewerScroll = (
  {
    documentRef,
    setCurrentPage,
    pageHeights,
    pageNumber,
  }:
  {
    documentRef: React.MutableRefObject<HTMLDivElement>,
    setCurrentPage: (pageNumber: number) => void,
    pageHeights: number[],
    pageNumber: number,
  }
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onScroll = useCallback(debounce((event: HTMLElementEventMap[`scroll`]) => {
    const element = event.target as HTMLDivElement
    if(element){
      // recursive ratio function
      // use fixed gap
      // curScroll/maxScroll

      const maxScroll = element.scrollHeight - element.clientHeight
      const curScroll = element.scrollTop
      const viewportHeightRatio = element.clientHeight / pageHeights[pageNumber]
      // const scrollThreshold = viewportHeightRatio > 1 ? viewportHeightRatio : 
      const { index } = pageHeights.reduce((acc, pageHeight, index) => {
        if(curScroll < (acc.sum + (pageHeight * (1 - (viewportHeightRatio / 2))))){
          return acc
        }
        return {
          index: index + 1,
          sum: acc.sum + pageHeight,
        }
      }, {
        index: 0,
        sum: 0,
      })
      console.log(`scroll set current page`, index + 1)
      // console.log(`scrollThreshold`, scrollThreshold)
      console.log(curScroll)
      console.log(pageHeights)
      setCurrentPage(index + 1)
      // if(index === -1){
      //   setCurrentPage(1)
      // } else if(pageHeights.length === index + 1){
      //   setCurrentPage(index + 1)
      // } else {
        
      // }
    }
  }), [pageHeights])
  
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