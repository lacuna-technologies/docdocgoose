import { useCallback, useEffect } from 'react'

const GAP_SIZE = 20 // in pixels

const getScrollRatio = (curSum: number, index: number, curScroll: number, pageHeights: number[]): number => {
  if(curScroll === 0){
    return 0
  }
  const prevIndex = index - 1
  const fullCurSum = curSum + (GAP_SIZE * prevIndex)
  if(fullCurSum === curScroll){
    return pageHeights.length - 1
  }
  if(fullCurSum >= curScroll){
    const prevPage = pageHeights[prevIndex]
    return prevIndex + ((prevPage - (fullCurSum - curScroll)) / prevPage)
  }
  if(index >= pageHeights.length){
    return pageHeights.length
  }
  return getScrollRatio(curSum + pageHeights[index], index + 1, curScroll, pageHeights)
}

const getPageHeights = (pageOrder: PageInfo[]) => pageOrder.map(({ height, width, rotation }) => (
  // assume all pages are rectangular
  (rotation % 180 === 90) ? width : height
))

const usePdfViewerScroll = (
  {
    documentRef,
    setCurrentPage,
    pageOrder,
  }:
  {
    documentRef: React.MutableRefObject<HTMLDivElement>,
    setCurrentPage: (pageIndex: number) => void,
    pageOrder: PageInfo[],
    pageIndex: number,
  }
) => {
  const onScroll = useCallback((event: HTMLElementEventMap[`scroll`]) => {
    const element = event.target as HTMLDivElement
    if(element){
      const curScroll = element.scrollTop
      const pageHeights = getPageHeights(pageOrder)
      const scrollRatio = getScrollRatio(0, 0, curScroll, pageHeights)
      const scrollPageIndex = Math.min(Math.floor(scrollRatio + 0.3), pageOrder.length - 1)
      setCurrentPage(scrollPageIndex)
    }
  }, [pageOrder, setCurrentPage])

  const scrollToPage = useCallback((pageIndex: number) => {
    if(documentRef !== null){
      const pageHeights = getPageHeights(pageOrder)
      const scrollHeight = (
        (pageIndex * GAP_SIZE) +
        pageHeights.slice(0, pageIndex).reduce((acc, cur) => acc + cur, 0)
      )
      documentRef.current.scrollTo(0, scrollHeight)
    }
  }, [documentRef, pageOrder])
  
  useEffect(() => {
    if(documentRef !== null){
      const ref = documentRef.current
      ref.addEventListener(`scroll`, onScroll)
      return () => {
        ref.removeEventListener(`scroll`, onScroll)
      }
    }
  }, [documentRef, onScroll])

  return {
    scrollToPage,
  }
}

export default usePdfViewerScroll