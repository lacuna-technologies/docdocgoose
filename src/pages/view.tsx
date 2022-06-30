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
            <div className="flex gap-2 items-center select-none">
              <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing file
            </div>
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