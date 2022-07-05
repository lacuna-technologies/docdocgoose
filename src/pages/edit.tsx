/* page that shows after unrestricted file is selected */
import React from 'react'
import dynamic from 'next/dynamic'
import { PrimaryButton, SecondaryButton } from 'components/button'
import Storage from 'utils/Storage'
import type { NextPage } from 'next'
import Spinner from 'components/spinner'
import useEditPdf from 'hooks/useEditPdf'
import usePdfViewerRotate from 'hooks/usePdfViewerRotate'
import usePdfViewerPage from 'hooks/usePdfViewerPage'
import { truncateFilename } from 'utils/Utils'
import Head from 'next/head'

const PdfViewer = dynamic(() => import(`components/PdfViewer`), { ssr: false })

interface Props {
  wasmLoaded: boolean
}

const View: NextPage<Props> = ({ wasmLoaded }) => {
  const file = Storage.getFile()

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

  const shortFileName = truncateFilename(file.name)

  return (
    <>
      <Head>
        <title>{file.name} | 📄 DocsTogether</title>
      </Head>
      <div className="bg-slate-200 h-full min-h-screen max-h-screen flex flex-col">
        <div className="flex justify-between p-4">
          <SecondaryButton
            href="/"
            className="w-fit"
          >
            ◀️ Pick another file
          </SecondaryButton>
          <div>
            {shortFileName}
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
        <PdfViewer
          file={file}
          loadingComponent={
            <div className="p-6">
              <Spinner>Loading document...</Spinner>
            </div>
          }
          onDocumentLoad={onDocumentLoad}
          gotoPage={gotoPage}
          pageNumber={pageNumber}
          numPages={numPages}
          rotations={rotations}
          rotatePage={rotatePage}
        />
      </div>
    </>
  )
}

export default View