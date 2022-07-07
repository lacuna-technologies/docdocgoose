import { PrimaryButton, SecondaryButton } from 'components/button'
import InfoField from 'components/info/InfoField'
import Spinner from 'components/spinner'
import useFileInfo from 'hooks/useFileInfo'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import Storage from 'utils/Storage'
import { humanFileSize } from 'utils/Utils'

interface Props {
  wasmLoaded: boolean
}

const Info: NextPage<Props> = ({ wasmLoaded }) => {
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
    setNewFileInfo,
    savingFileInfo,
    saveFileInfo,
  } = useFileInfo({ file, wasmLoaded })

  useEffect(() => {
    if(fileInfo.encrypted){
      router.replace(`/view`)
    }
  }, [fileInfo, router])

  const onChangeField = useCallback((key: string, value: string) => {
    setNewFileInfo(info => ({
      ...info,
      [key]: value,
    }))
  }, [setNewFileInfo])

  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <div className="container max-w-screen-lg mx-auto py-4 px-4 flex flex-col overflow-hidden">
        <div className="flex flex-row justify-between mb-4">
          <SecondaryButton
            href="/edit"
            className="w-fit"
          >
            ◀️ Back
          </SecondaryButton>
          <PrimaryButton
            onClick={saveFileInfo}
            loading={savingFileInfo}
            loadingComponent={
              <Spinner>Saving changes</Spinner>
            }
            title="Save the current version of your document"
          >
            💾<span className="hidden md:inline-block">&nbsp;Save</span>
          </PrimaryButton>
        </div>
        {
          fileLoaded ? (
            <div className="flex flex-col gap-2 overflow-auto grow py-4">
              <InfoField
                label="Title"
                value={fileInfo.title}
                onChangeField={onChangeField}
                infoKey="title"
              />
              <InfoField
                label="Author"
                value={fileInfo.author}
                onChangeField={onChangeField}
                infoKey="author"
              />
              <InfoField
                label="Subject"
                value={fileInfo.subject}
                onChangeField={onChangeField}
                infoKey="subject"
              />
              
              <InfoField
                label="File Name"
                value={file.name}
              />
              <InfoField
                label="File Size"
                value={`${humanFileSize(file.size)} (${file.size} bytes)`}
              />
              <InfoField
                label="Page count"
                value={`${fileInfo.pageCount}`}
              />
              <InfoField
                label="Page size"
                value={fileInfo.pageSize}
              />
              <InfoField
                label="Creation date"
                value={fileInfo.creationDate}
              />
              <InfoField
                label="Modification date"
                value={fileInfo.modificationDate}
              />
              <InfoField
                label="PDF Producer"
                value={fileInfo.pdfProducer}
              />
              <InfoField
                label="Content Creator"
                value={fileInfo.contentCreator}
              />
              
              <InfoField
                label="Properties"
                value={fileInfo.properties}
              />
            </div>
          ) : (
            <Spinner>Processing file</Spinner>
          )
        }
        {error !== null ? (
          <div className="flex gap-2 items-center select-none">
            ❌ {error}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Info