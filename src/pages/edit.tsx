/* page that shows after unrestricted file is selected */
/* page that shows after restricted file is selected */
import React from 'react'
import dynamic from 'next/dynamic'
import Header from 'components/header'
import Footer from 'components/footer'
import { PrimaryButton, SecondaryButton } from 'components/button'
import Storage from 'utils/Storage'
import type { NextPage } from 'next'
import { humanFileSize } from 'utils/Utils'
import useFileInfo from 'hooks/useFileInfo'
import FileInfoDetails from 'components/fileInfoDetails'
import Spinner from 'components/spinner'
import useEditPdf from 'hooks/useEditPdf'
import usePdfViewerRotate from 'hooks/usePdfViewerRotate'
import usePdfViewerPage from 'hooks/usePdfViewerPage'

const PdfViewer = dynamic(() => import(`components/PdfViewer`), { ssr: false })

const Attribute = ({ children }) => {
  return (
    <small className="after:ml-2 after:content-['·'] last-of-type:after:content-[''] last-of-type:after:ml-0">
      {children}
    </small>
  )
}

interface Props {
  wasmLoaded: boolean
}

const View: NextPage<Props> = ({ wasmLoaded }) => {
  const file = Storage.getFile()
  const {
    fileLoaded,
    error,
    fileInfo,
  } = useFileInfo({ file, wasmLoaded })

  const {
    numPages,
    pageNumber,
    onDocumentLoad,
    gotoPage,
  } = usePdfViewerPage()

  const {
    rotatePage,
    rotations,
  } = usePdfViewerRotate({ numPages, pageNumber })

  const {
    saveFile,
    editing,
  } = useEditPdf({ file, rotations })

  return (
    <div className="bg-slate-200 h-full min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-screen-lg mx-auto py-8 px-4 grow">
        {fileLoaded
          ? (
            <div>
              <SecondaryButton
                href="/"
                className="w-fit"
              >
                ◀️ Pick another file
              </SecondaryButton>
              <div className="flex items-center justify-between gap-4 mt-6">
                <div>
                  <h1 className="font-bold text-xl">
                    {file.name}
                  </h1>
                  <div className="flex gap-x-2">
                    <Attribute>{humanFileSize(file.size)}</Attribute>
                    {(fileInfo.pageCount && Number.isInteger(fileInfo.pageCount)) &&
                      <Attribute>{fileInfo.pageCount} pages</Attribute>}
                    {typeof fileInfo.encrypted !== `undefined` &&
                      <Attribute>{fileInfo.encrypted ? `Encrypted` : `Not encrypted`}</Attribute>}
                    {/* {fileInfo.permissions &&
                      <Attribute>{fileInfo.permissions}</Attribute>} */}
                  </div>
                </div>
                <PrimaryButton
                  onClick={saveFile}
                  loadingComponent={
                    <Spinner>Saving changes</Spinner>
                  }
                  loading={editing}
                  title="Save the current version of your document"
                >
                  💾 Save
                </PrimaryButton>
              </div>
              <FileInfoDetails
                className="mt-2"
                fileInfo={fileInfo}
              />
              <PdfViewer
                file={file}
                className="my-6 select-none"
                pageClassName="h-96 overflow-auto resize-y"
                loadingComponent={
                  <div className="p-6">
                    <Spinner>Loading document...</Spinner>
                  </div>
                }
                encrypted={fileInfo.encrypted}
                onDocumentLoad={onDocumentLoad}
                gotoPage={gotoPage}
                pageNumber={pageNumber}
                numPages={numPages}
                rotations={rotations}
                rotatePage={rotatePage}
              />
            </div>
          ) : (
            <Spinner>Processing file</Spinner>
          )}
          {error !== null ? (
            <div className="flex gap-2 items-center select-none">
              ❌ {error}
            </div>
          ) : null}
      </div>
      <Footer />
    </div>
  )
}

export default View