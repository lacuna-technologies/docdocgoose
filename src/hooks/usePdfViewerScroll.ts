import { useCallback, useEffect } from 'react'

// https://github.com/michaeldzjap/react-pdf-sample/tree/master/src
// https://github.com/bvaughn/react-window

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

const usePdfViewerScroll = (
  {
    documentRef,
    setCurrentPage,
    pageIndex,
    pageOrder,
  }:
  {
    documentRef: React.MutableRefObject<HTMLDivElement>,
    setCurrentPage: (pageIndex: number) => void,
    pageOrder: PageInfo[],
    pageIndex: number,
  }
) => {
  // const getScaledPageHeights = useCallback((element: HTMLDivElement) => {
  //   const maxScroll = element.scrollHeight - element.clientHeight
  //   const pageHeights = pageOrder.map(({ height }) => height).reduce((a, b) => a + b, 0)
  //   const scale = maxScroll / (pageHeights + (pageOrder.length * GAP_SIZE))
  //   const scaledPageHeights = pageHeights.map(h => h * scale)
  //   return scaledPageHeights
  // }, [pageOrder])

  const onScroll = useCallback((event: HTMLElementEventMap[`scroll`]) => {
    const element = event.target as HTMLDivElement
    if(element){
      const curScroll = element.scrollTop
      const pageHeights = pageOrder.map(({ height }) => height)
      const scrollRatio = getScrollRatio(0, 0, curScroll, pageHeights)
      const scrollPageIndex = Math.min(Math.floor(scrollRatio + 0.3), pageOrder.length - 1)
      setCurrentPage(scrollPageIndex)
    }
  }, [pageOrder, setCurrentPage])

  const scrollToPage = useCallback((pageIndex: number) => {
    if(documentRef !== null){
      const pageHeights = pageOrder.map(({ height }) => height)
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