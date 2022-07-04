import React from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import type { File } from 'utils/Storage'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer'
import usePdfViewerResize from 'hooks/usePdfViewerResize'
import usePdfViewerPage from 'hooks/usePdfViewerPage'
import usePdfViewerZoom from 'hooks/usePdfViewerZoom'

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

interface Props {
  file: File,
  className?: string,
  pageClassName?: string,
  loadingComponent?: React.ReactElement,
}

const PdfViewer: React.FC<Props> = ({
  file,
  className = ``,
  pageClassName = ``,
  loadingComponent,
}) => {
  const {
    onDocumentLoad,
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
  
  return (
    <Document
      file={file}
      className={className}
      renderMode="svg"
      loading={loadingComponent}
      onLoadSuccess={onDocumentLoad}
      externalLinkTarget="_blank"
    >
      <Page
        pageNumber={1}
        className={pageClassName}
        inputRef={pageDiv}
        onLoadSuccess={onPageLoad}
        scale={scale * zoom}
      />
      <div className="flex gap-3 relative mt-[-60px] ml-[calc(100%-120px)] font-black text-white text-xl">
        <ZoomButton onClick={zoomIn}>
          +
        </ZoomButton>
        <ZoomButton onClick={zoomOut}>
          -
        </ZoomButton>
      </div>
    </Document>
  )
}

export default PdfViewer