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
import FileInfoDetails from 'components/fileInfoDetails'
import Spinner from 'components/spinner'

interface Props {
  wasmLoaded: boolean
}

const View: NextPage<Props> = ({ wasmLoaded }) => {
  const file = Storage.getFile()
  const {
    fileLoaded,
    error,
    fileInfo
  } = useFileInfo({ file, wasmLoaded })

  const {
    optimising,
    optimisedResult,
    optimisePdf
  } = useOptimisePdf({ file })

  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <div className="container max-w-screen-lg mx-auto py-8 grow">
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
                <small className="after:ml-2 after:content-['·']">
                  {humanFileSize(file.size)}
                </small>
                <small className="after:ml-2 after:content-['·']">
                  {fileInfo.pageCount} pages
                </small>
                <small className="after:ml-2 after:content-['·']">
                  {fileInfo.encrypted ? `Encrypted` : `Not encrypted`}
                </small>
                <small>
                  {fileInfo.permissions}
                </small>
              </div>
              <FileInfoDetails
                className="mt-2"
                fileInfo={fileInfo}
              />
              <div className="grid grid-cols-3 mt-6">
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
                            ? (<small className="text-xs">({humanFileSize(optimisedResult.size)}, {((file.size - optimisedResult.size)/file.size*100).toFixed(1)}% smaller)</small>)
                            : null}
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
      <Footer></Footer>
    </div>
  )
}

export default View