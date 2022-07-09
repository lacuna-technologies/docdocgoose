import React, { useCallback } from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5'
import usePdfViewerZoom from 'hooks/usePdfViewerZoom'
import type { DocumentProps, PDFPageProxy } from 'react-pdf'
import MainPage from 'components/pdf/edit/mainPage'
import DocumentBottomBar from 'components/pdf/edit/documentBottomBar'
import usePdfViewerScroll from 'hooks/usePdfViewerScroll'
import LeftSideBar from 'components/pdf/edit/leftSidebar'
import RightSideBar from './rightSidebar'
import EditableContent from './editableContent'
import useEditableContent from 'hooks/useEditableContent'

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
  editableContentProps: ReturnType<typeof useEditableContent>,
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
  editableContentProps: { addBox, ...editableContentProps},
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
        addBox={addBox}
      />
      <div className="flex flex-col max-w-full overflow-hidden grow" id="main-document">
        <Document
          file={file}
          className="grow overflow-auto max-w-full flex flex-col gap-[20px] relative"
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
          <EditableContent
            bounds=".react-pdf__Page[data-page-number='1']"
            {...editableContentProps}
          />
        </Document>
        <DocumentBottomBar
          pageIndex={pageIndex}
          pageOrder={pageOrder}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomFullWidth={zoomFullWidth}
        />
      </div>
      <RightSideBar
        file={file}
        pageIndex={pageIndex}
        pageOrder={pageOrder}
        selectPage={selectPage}
      />
    </div>
  )
}

export default PdfViewer