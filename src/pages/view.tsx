/* page that shows after restricted file is selected */
import React, { useEffect } from 'react'
import Header from 'components/header'
import Footer from 'components/footer'
import { SecondaryButton } from 'components/button'
import Storage from 'utils/Storage'
import type { NextPage } from 'next'
import { humanFileSize } from 'utils/Utils'
import useFileInfo from 'hooks/useFileInfo'
import FileInfoDetails from 'components/fileInfoDetails'
import Spinner from 'components/spinner'
import { InfoAdmonition } from 'components/admonition'
import { useRouter } from 'next/router'
import DecryptButton from 'components/view/decryptButton'

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
  const router = useRouter()
  const file = Storage.getFile()

  useEffect(() => {
    if(!file){
      router.replace(`/`)
    }
  }, [file, router])

  const {
    fileLoaded,
    error,
    fileInfo,
    reloadFile,
  } = useFileInfo({ file, wasmLoaded })

  useEffect(() => {
    if(file && fileInfo.encrypted === false){
      router.replace(`/edit`)
    }
  }, [file, fileInfo, router])

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
              </div>
              <FileInfoDetails
                className="mt-2"
                fileInfo={fileInfo}
              />
              <div className="grid md:grid-cols-3 grid-cols-1 mt-2 gap-4">
                <DecryptButton
                  file={file}
                  fileInfo={fileInfo}
                  reloadFile={reloadFile}
                />
              </div>

              {
                fileInfo.encrypted !== false
                  ? (
                    <InfoAdmonition className="my-4">
                      <strong>🔒 Restrictions</strong>
                      <p>There are restrictions on this document that must be removed before the document can be edited.</p>
                    </InfoAdmonition>
                  ) : null
              }
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