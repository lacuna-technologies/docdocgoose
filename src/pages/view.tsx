/* page that shows after file is selected */
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Header from 'components/header'
import Footer from 'components/footer'
import Storage from 'utils/Storage'
import PdfCpu from 'utils/PdfCpu'
import type { FileInfo } from 'utils/PdfCpu'
import type { NextPage } from 'next'
import { humanFileSize } from 'utils/Uitls'

interface Props {
  wasmLoaded: boolean
}

const file = Storage.getFile()

const FileInfoDetails = (
  { className, fileInfo }:
  { className: string, fileInfo: FileInfo }
) => {
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])
  return (
    <div className={className}>
      <a className="cursor-pointer" onClick={toggleExpanded}>
        <small>({expanded ? `hide` : `show`} more details)</small>
      </a>
      <pre className={`mt-2 text-sm ${expanded ? `` : `hidden`}`}>
        {JSON.stringify(fileInfo, null, 2)}
      </pre>
    </div>
  )
}

const View: NextPage<Props> = ({ wasmLoaded }) => {
  const router = useRouter()
  const [fileLoaded, setFileLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [fileInfo, setFileInfo] = useState({} as FileInfo)
  useEffect(() => {
    if(typeof file === `undefined`){
      router.push(`/`)
    }
    if(wasmLoaded && PdfCpu.go === null){
      console.debug(`go is not yet defined`)
      return
    }
    (async () => {
      const arrayBuffer = await file.arrayBuffer()
      globalThis.fs.writeFile(`/${file.path}`, Buffer.from(arrayBuffer), async (err: any) => {
        if(err){
          throw err
        }
        try {
          const result = await PdfCpu.getInfo(`/${file.path}`)
          setFileLoaded(true)
          setFileInfo(result)
        } catch (error){
          console.error(error)
          setError(`Something went wrong when processing your file`)
        }
      })
    })()
  }, [file, wasmLoaded])
  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <div className="container max-w-screen-lg mx-auto py-8 grow">
        {fileLoaded
          ? (
            <div>
              <a className="font-light rounded bg-slate-300 px-4 py-2 w-fit cursor-pointer no-underline border border-slate-400 hover:border-slate-500" href="/">
                ◀️ Pick another file
              </a>
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
            </div>
          ) : (
            <div className="flex gap-2 items-center select-none">
              <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
                <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing file
            </div>
          )}
      </div>
      <Footer></Footer>
    </div>
  )
}

export default View