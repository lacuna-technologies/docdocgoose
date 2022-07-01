/* page that shows after file is selected */
import React, { useState, useCallback } from 'react'
import Header from 'components/header'
import Footer from 'components/footer'
import { SecondaryButton } from 'components/button'
import Storage from 'utils/Storage'
import type { NextPage } from 'next'
import { humanFileSize } from 'utils/Uitls'
import useFileInfo from 'hooks/useFileInfo'
import FileInfoDetails from 'components/fileInfoDetails'
import PdfCpu from 'utils/PdfCpu'
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

  const optimisePdf = useCallback(async () => {
    const arrayBuffer = await file.arrayBuffer()
    globalThis.fs.writeFile(`/${file.path}`, Buffer.from(arrayBuffer), async (err: any) => {
      if(err){
        throw err
      }
      try {
        const result = await PdfCpu.optimise(`/${file.path}`)
        console.log(result)
      } catch (error){
        console.error(error)
      }
    })
  }, [file])

  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <div className="container max-w-screen-lg mx-auto py-8 grow">
        {fileLoaded
          ? (
            <div>
              <SecondaryButton
                href="/"
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
                <SecondaryButton onClick={optimisePdf}>
                  🪄 Optimise
                </SecondaryButton>
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