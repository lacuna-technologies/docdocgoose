/* page that shows after unrestricted file is selected */
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PrimaryButton, SecondaryButton } from 'components/button'
import Storage from 'utils/Storage'
import type { NextPage } from 'next'
import Spinner from 'components/spinner'
import useEditPdf from 'hooks/useEditPdf'
import usePdfViewerPage from 'hooks/usePdfViewerPage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useEditableContent from 'hooks/useEditableContent'

const PdfViewer = dynamic(() => import(`components/PdfViewer`), { ssr: false })

interface Props {
  wasmLoaded: boolean
}

const Edit: NextPage<Props> = () => {
  const router = useRouter()
  const file = Storage.getFile()

  useEffect(() => {
    if(!file){
      router.replace(`/pdf/edit`)
    }
  }, [file, router])

  const pageProps = usePdfViewerPage()

  const editableContentProps = useEditableContent()
  const {
    saveFile,
    editing,
  } = useEditPdf({ file, pageOrder: pageProps.pageOrder })

  return (
    <>
      <Head>
        <title>{file?.name} | 📄 DocsTogether</title>
      </Head>
      <div className="bg-slate-200 h-full min-h-screen max-h-screen flex flex-col">
        <div className="flex justify-between md:p-4 p-2 gap-2">
          <SecondaryButton
            href="/"
            className="w-fit"
          >
            ◀️<span className="hidden md:inline-block">&nbsp;Pick another file</span>
          </SecondaryButton>
          <div className="text-center truncate overflow-x-auto">
            {file?.name}
          </div>
          <PrimaryButton
            onClick={saveFile}
            loadingComponent={
              <Spinner>Saving changes</Spinner>
            }
            loading={editing}
            title="Save the current version of your document"
          >
            💾<span className="hidden md:inline-block">&nbsp;Save</span>
          </PrimaryButton>
        </div>
        <PdfViewer
          file={file}
          loadingComponent={
            <div className="p-6">
              <Spinner>Loading document...</Spinner>
            </div>
          }
          {...pageProps}
          {...editableContentProps}
        />
      </div>
    </>
  )
}

export default Edit