/* page that shows after file is selected */
import React from 'react'
import Header from 'components/header'
import Footer from 'components/footer'
import { PrimaryButton, SecondaryButton } from 'components/button'
import Storage from 'utils/Storage'
import type { NextPage } from 'next'
import { humanFileSize } from 'utils/Utils'
import useFileInfo from 'hooks/useFileInfo'
import useOptimisePdf from 'hooks/useOptimisePdf'
import useDecryptPdf from 'hooks/useDecryptPdf'
import FileInfoDetails from 'components/fileInfoDetails'
import Spinner from 'components/spinner'
import { InfoAdmonition } from 'components/admonition'
import PdfViewer from 'components/PdfViewer'

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
    optimising,
    optimisedResult,
    optimisePdf,
  } = useOptimisePdf({ file })

  const {
    decryptPdf,
    decrypting,
    decryptedResult,
  } = useDecryptPdf({ file })

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
              <h1 className="font-bold text-xl mt-6">
                {file.path}
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
              <FileInfoDetails
                className="mt-2"
                fileInfo={fileInfo}
              />
              <PdfViewer
                file={file}
                className="my-6"
                pageClassName="h-96 overflow-auto resize-y"
                loadingComponent={
                  <div className="p-6">
                    <Spinner>Loading document...</Spinner>
                  </div>
                }
              />
              { fileInfo.encrypted === true && (
                <InfoAdmonition className="my-4">
                  <strong>🔒 Restrictions</strong>
                  <p>There are restrictions on this document that must be removed before the document can be edited.</p>
                </InfoAdmonition>
              ) }
              <div className="grid md:grid-cols-3 grid-cols-1 mt-6 gap-4">
                {
                  optimisedResult === null ? (
                    <PrimaryButton
                      onClick={optimisePdf}
                      loading={optimising}
                      loadingComponent={
                        <>
                          <Spinner>Optimising...</Spinner>
                        </>
                      }
                      title="Reduce the size of your document"
                    >
                      🪄 Optimise
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton href={optimisedResult.url} download={optimisedResult.fileName}>
                      <div className="flex justify-center items-center gap-4">
                        <div className="text-2xl">💾</div>
                        <div>
                          <p>Save optimised file</p>
                          {(optimisedResult.size < file.size)
                            ? (<small className="text-xs">
                                ({humanFileSize(optimisedResult.size)},&nbsp;
                                {((file.size - optimisedResult.size)/file.size*100).toFixed(1)}
                                % smaller)
                              </small>)
                            : null}
                        </div>
                      </div>
                    </PrimaryButton>
                  )
                }
                {
                  decryptedResult === null ? (
                    <PrimaryButton
                      onClick={decryptPdf}
                      loading={decrypting}
                      loadingComponent={
                        <>
                          <Spinner>Decrypting...</Spinner>
                        </>
                      }
                      title="Remove edit restrictions"
                    >
                      🔓 Remove restrictions
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton href={decryptedResult.url} download={decryptedResult.fileName}>
                      <div className="flex justify-center items-center gap-4">
                        <div className="text-2xl">💾</div>
                        <div>
                          <p>Save decrypted file</p>
                        </div>
                      </div>
                    </PrimaryButton>
                  )
                }
              </div>
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