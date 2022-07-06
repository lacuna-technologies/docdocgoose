import React, { useCallback } from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5'
import usePdfViewerZoom from 'hooks/usePdfViewerZoom'
import { PrimaryButton } from 'components/button'
import type { DocumentProps } from 'react-pdf'
import MiniPage from 'components/edit/miniPage'
import MainPage from 'components/edit/mainPage'
import DocumentBottomBar from 'components/edit/documentBottomBar'
import usePdfViewerScroll from 'hooks/usePdfViewerScroll'

interface Props {
  file: File,
  loadingComponent?: React.ReactElement,
  onDocumentLoad: DocumentProps[`onLoadSuccess`],
  pageIndex: number,
  pageOrder: PageInfo[],
  setCurrentPage: (pageIndex: number) => void,
  rotatePage: (pageIndex: number) => void,
  removeCurrentPage: () => void,
  scale: number,
  documentRef: React.RefObject<HTMLDivElement>,
  setPage: (pageIndex: number, action: (p: PageInfo) => PageInfo) => void,
}

const PdfViewer: React.FC<Props> = ({
  file,
  loadingComponent,
  onDocumentLoad,
  pageIndex,
  pageOrder,
  setCurrentPage,
  rotatePage,
  removeCurrentPage,
  documentRef,
  scale,
  setPage,
}) => {
  const {
    zoom,
    zoomIn,
    zoomOut,
  } = usePdfViewerZoom()
  const { scrollToPage } = usePdfViewerScroll({ documentRef, pageIndex, pageOrder, setCurrentPage })

  const selectPage = useCallback((pageIndex: number) => {
    // setCurrentPage(pageIndex)
    scrollToPage(pageIndex)
  }, [scrollToPage])

  const onClickRotate = useCallback(() => {
    rotatePage(pageIndex)
  }, [pageIndex, rotatePage])

  const onClickDelete = useCallback(() => {
    const confirmDelete = window.confirm(`Are you sure you want to delete page ${pageIndex + 1}?`)
    if(confirmDelete){
      removeCurrentPage()
    }
  }, [pageIndex, removeCurrentPage])

  const computedScale = scale * zoom
  const numPages = pageOrder.length

  return (
    <div className="flex max-h-full overflow-hidden select-none">
      <div className="flex flex-col flex-none px-4">
        <div>
          <strong>PAGE</strong>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 mt-2 gap-4">
          <PrimaryButton onClick={onClickRotate}>
            🔃 Rotate
          </PrimaryButton>
          <PrimaryButton onClick={onClickDelete}>
            🗑️ Delete
          </PrimaryButton>
        </div>
      </div>
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
                    pageIndex={index}
                    rotation={rotation}
                    scale={computedScale}
                    setPage={setPage}
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
        />
      </div>
      <Document
        file={file}
        className="flex flex-none flex-col gap-1 overflow-auto ml-4"
      >
        {
          (Array.isArray(pageOrder) && numPages > 0) && (
            pageOrder.map(({ pageNumber, rotation }, index) => {
              return (
                <MiniPage
                  key={`mini-page-${pageNumber}`}
                  current={index === pageIndex}
                  pageIndex={index}
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