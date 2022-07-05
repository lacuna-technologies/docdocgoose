import React, { useCallback, useRef } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer'
import usePdfViewerResize from 'hooks/usePdfViewerResize'
import usePdfViewerZoom from 'hooks/usePdfViewerZoom'
import { PrimaryButton, SecondaryButton } from 'components/button'
import type { DocumentProps } from 'react-pdf'
import usePdfViewerScroll from 'hooks/usePdfViewerScroll'

const ZoomButton = ({ children, onClick = () => {} }) => {
  return (
    <div
      className="shrink bg-slate-700 rounded-full w-9 h-9 flex justify-center items-center border border-slate-400 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const MiniPage = ({ pageNumber, gotoPage, rotation, current }) => {
  const onClick = useCallback(() => {
    gotoPage(pageNumber)
  }, [pageNumber, gotoPage])
  const currentClass = current ? `bg-slate-300` : ``

  return (
    <div className={`flex gap-2 p-4 ${currentClass} cursor-pointer`} onClick={onClick}>
      <div className={current ? `text-slate-700` : `text-slate-500`}>
        {pageNumber}
      </div>
      <Page
        className="select-none cursor-pointer"
        pageNumber={pageNumber}
        scale={0.2}
        rotate={rotation}
      />
    </div>
  )
}

interface Props {
  file: File,
  loadingComponent?: React.ReactElement,
  onDocumentLoad: DocumentProps[`onLoadSuccess`],
  pageNumber: number,
  numPages: number,
  gotoPage: (p: number) => void,
  rotations: number[],
  rotatePage: () => void,
}

const PdfViewer: React.FC<Props> = ({
  file,
  loadingComponent,
  onDocumentLoad,
  pageNumber = 1,
  numPages = 0,
  gotoPage,
  rotations = [],
  rotatePage,
}) => {
  const mainDocumentDiv = useRef(null)
  const mainPageDiv = useRef(null)

  const {
    onPageLoad,
    scale,
  } = usePdfViewerResize({ pageDiv: mainPageDiv })

  const {
    zoom,
    zoomIn,
    zoomOut,
  } = usePdfViewerZoom()

  usePdfViewerScroll({ documentRef: mainDocumentDiv })

  const currentRotation = rotations[pageNumber - 1]

  return (
    <div className="flex max-h-full overflow-hidden select-none">
      <div className="flex flex-col flex-none px-4">
        <div>
          <strong>PAGE</strong>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 mt-2 gap-4">
          <PrimaryButton onClick={rotatePage}>
            🔃 Rotate
          </PrimaryButton>
          <PrimaryButton>
            🗑️ Delete
          </PrimaryButton>
        </div>
      </div>
      <div className="flex flex-col max-w-full overflow-hidden grow">
        <Document
          file={file}
          className="grow overflow-auto max-w-full"
          loading={loadingComponent}
          onLoadSuccess={onDocumentLoad}
          externalLinkTarget="_blank"
          inputRef={mainDocumentDiv}
        >
          <Page
            pageNumber={pageNumber}
            inputRef={mainPageDiv}
            onLoadSuccess={onPageLoad}
            scale={scale * zoom}
            rotate={currentRotation}
          />
        </Document>
        <div className="flex justify-between items-center gap-4 p-4">
          <SecondaryButton>
            ℹ️ Info
          </SecondaryButton>
          <div>
            {pageNumber} / {numPages}
          </div>
          <div className="flex gap-3 font-black text-white text-xl">
            <ZoomButton onClick={zoomIn}>
              +
            </ZoomButton>
            <ZoomButton onClick={zoomOut}>
              -
            </ZoomButton>
          </div>
        </div>
      </div>
      <Document
        file={file}
        className="flex flex-none flex-col gap-1 overflow-auto"
      >
        {
          (Number.isInteger(numPages) && numPages > 0) && (
            Array.from({ length: numPages }, (v, i) => i + 1).map((num) => (
              <MiniPage
                key={`mini-page-${num}`}
                current={pageNumber === num}
                pageNumber={num}
                gotoPage={gotoPage}
                rotation={rotations[num - 1]}
              />
            ))
          )
        }
      </Document>
    </div>
  )
}

export default PdfViewer