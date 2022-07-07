import React, { useCallback } from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5'
import usePdfViewerZoom from 'hooks/usePdfViewerZoom'
import type { DocumentProps, PDFPageProxy } from 'react-pdf'
import MiniPage from 'components/pdf/edit/miniPage'
import MainPage from 'components/pdf/edit/mainPage'
import DocumentBottomBar from 'components/pdf/edit/documentBottomBar'
import usePdfViewerScroll from 'hooks/usePdfViewerScroll'
import LeftSideBar from 'components/pdf/edit/leftSidebar'

interface Props {
  file: File,
  loadingComponent?: React.ReactElement,
  movePage: (pageIndex: number, newPageIndex: number) => void,
  onDocumentLoad: DocumentProps[`onLoadSuccess`],
  pageIndex: number,
  pageOrder: PageInfo[],
  setCurrentPage: (pageIndex: number) => void,
  rotatePage: (pageIndex: number) => void,
  removeCurrentPage: () => void,
  scale: number,
  documentRef: React.RefObject<HTMLDivElement>,
  setPage: (pageIndex: number, action: (p: PageInfo) => PageInfo) => void,
  zoomFullWidth: (pageWidth?: number) => void,
}

const PdfViewer: React.FC<Props> = ({
  file,
  loadingComponent,
  movePage,
  onDocumentLoad,
  pageIndex,
  pageOrder,
  setCurrentPage,
  rotatePage,
  removeCurrentPage,
  documentRef,
  scale,
  setPage,
  zoomFullWidth,
}) => {
  const {
    zoom,
    zoomIn,
    zoomOut,
  } = usePdfViewerZoom()
  const { scrollToPage } = usePdfViewerScroll({ documentRef, pageIndex, pageOrder, setCurrentPage })

  const selectPage = useCallback((pageIndex: number) => {
    scrollToPage(pageIndex)
  }, [scrollToPage])

  const onFirstPageLoad = useCallback((page: PDFPageProxy) => {
    zoomFullWidth(page.originalWidth)
  }, [zoomFullWidth])

  const computedScale = scale * zoom
  const numPages = pageOrder.length

  return (
    <div className="flex md:flex-row flex-col md:gap-0 gap-2 max-h-full overflow-hidden select-none">
      <LeftSideBar
        pageIndex={pageIndex}
        removeCurrentPage={removeCurrentPage}
        rotatePage={rotatePage}
        numPages={numPages}
        movePage={movePage}
      />
      <div className="flex flex-col max-w-full overflow-hidden grow">
        <Document
          file={file}
          className="grow overflow-auto max-w-full flex flex-col gap-[20px]"
          loading={loadingComponent}
          onLoadSuccess={onDocumentLoad}
          externalLinkTarget="_blank"
          inputRef={documentRef}
        >
          {
            (Array.isArray(pageOrder) && numPages > 0) && (
              pageOrder.map(({ pageNumber, rotation }, index) => {
                return (
                  <MainPage
                    key={`main-page-${pageNumber}`}
                    pageIndex={pageNumber - 1}
                    rotation={rotation}
                    scale={computedScale}
                    setPage={setPage}
                    {...(index === 0 ? { onLoadSuccess: onFirstPageLoad } : {})}
                  />
                )
              })
            )
          }
        </Document>
        <DocumentBottomBar
          pageIndex={pageIndex}
          pageOrder={pageOrder}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomFullWidth={zoomFullWidth}
        />
      </div>
      <Document
        file={file}
        className="flex-none flex-col gap-1 overflow-auto ml-4 hidden md:flex"
      >
        {
          (Array.isArray(pageOrder) && numPages > 0) && (
            pageOrder.map(({ pageNumber, rotation }, index) => {
              return (
                <MiniPage
                  key={`mini-page-${pageNumber}`}
                  current={index === pageIndex}
                  pageIndex={pageNumber - 1}
                  selectPage={selectPage}
                  rotation={rotation}
                />
              )
            })
          )
        }
      </Document>
    </div>
  )
}

export default PdfViewer