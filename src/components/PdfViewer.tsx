import React, { useCallback } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { File } from 'utils/Storage'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer'
import usePdfViewerResize from 'hooks/usePdfViewerResize'
import usePdfViewerPage from 'hooks/usePdfViewerPage'
import usePdfViewerZoom from 'hooks/usePdfViewerZoom'
import { InfoAdmonition } from 'components/admonition'
import { PrimaryButton } from 'components/button'
import usePdfViewerRotate from 'hooks/usePdfViewerRotate'


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

const MiniPage = ({ pageNumber, gotoPage, rotation }) => {
  const onClick = useCallback(() => {
    gotoPage(pageNumber)
  }, [pageNumber, gotoPage])
  return (
    <Page
      className="select-none cursor-pointer"
      pageNumber={pageNumber}
      scale={0.2}
      onClick={onClick}
      rotate={rotation}
    />
  )
}

interface Props {
  file: File,
  className?: string,
  pageClassName?: string,
  loadingComponent?: React.ReactElement,
  encrypted: boolean,
}

const PdfViewer: React.FC<Props> = ({
  file,
  className = ``,
  pageClassName = ``,
  loadingComponent,
  encrypted,
}) => {
  const {
    numPages,
    pageNumber,
    onDocumentLoad,
    gotoPage,
  } = usePdfViewerPage()

  const {
    pageDiv,
    onPageLoad,
    scale,
  } = usePdfViewerResize()

  const {
    zoom,
    zoomIn,
    zoomOut,
  } = usePdfViewerZoom()

  const {
    rotatePage,
    currentRotation,
    rotations,
  } = usePdfViewerRotate({ numPages, pageNumber })

  return (
    <>
      <Document
        file={file}
        className={className}
        renderMode="svg"
        loading={loadingComponent}
        onLoadSuccess={onDocumentLoad}
        externalLinkTarget="_blank"
      >
        <Page
          pageNumber={pageNumber}
          className={pageClassName}
          inputRef={pageDiv}
          onLoadSuccess={onPageLoad}
          scale={scale * zoom}
          rotate={currentRotation}
        />
        <div className="flex justify-between items-center mt-2 gap-4">
          <div className="flex gap-1 overflow-auto">
            {
              Number.isInteger(numPages) && (
                Array.from({ length: numPages }, (v, i) => i + 1).map((pageNumber) => (
                  <MiniPage
                    key={`mini-page-${pageNumber}`}
                    pageNumber={pageNumber}
                    gotoPage={gotoPage}
                    rotation={rotations[pageNumber - 1]}
                  />
                ))
              )
            }
          </div>
          <div className="flex flex-col justify-around gap-4 items-center">
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
      </Document>
      {
        encrypted === true
          ? (
            <InfoAdmonition className="my-4">
              <strong>🔒 Restrictions</strong>
              <p>There are restrictions on this document that must be removed before the document can be edited.</p>
            </InfoAdmonition>
          ) : (
            <>
              <div className="mt-6">
                <strong>EDIT PAGE</strong>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 mt-2 gap-4">
                <PrimaryButton onClick={rotatePage}>
                  ↗️ Rotate
                </PrimaryButton>
                <PrimaryButton>
                  🗑️ Delete
                </PrimaryButton>
              </div>
            </>
          )
      }
    </>
  )
}

export default PdfViewer