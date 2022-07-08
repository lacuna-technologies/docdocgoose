/* page that shows after msword file is selected */
import { InfoAdmonition } from 'components/admonition'
import { PrimaryButton, SecondaryButton } from 'components/button'
import FileAttribute from 'components/FileAttribute'
import Spinner from 'components/spinner'
import useDocInfo from 'hooks/useDocInfo'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Storage from 'utils/Storage'
import { humanFileSize } from 'utils/Utils'

const View: NextPage = () => {
  const router = useRouter()
  const file = Storage.getFile()

  useEffect(() => {
    if(!file){
      router.replace(`/`)
    }
  }, [file, router])

  const {
    status: docStatus,
    removeEditProtection,
    unlockTrackChanges,
    saveFile,
  } = useDocInfo({ file })

  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <div className="container max-w-screen-lg h-full mx-auto py-4 px-4 flex flex-col overflow-hidden">
        <div className="flex flex-row justify-between mb-4">
          <SecondaryButton
            href="/"
            className="w-fit"
          >
            ◀️<span className="hidden md:inline-block">&nbsp;Pick another file</span>
          </SecondaryButton>
        </div>
        <div className="flex flex-col gap-2 overflow-auto py-4">
          <h1 className="font-bold text-xl">
            {file?.name}
          </h1>
          <div className="flex gap-x-2">
            <FileAttribute>{humanFileSize(file?.size)}</FileAttribute>
          </div>
        </div>
        <div className="py-4">
          {
            docStatus === `loading` ? (
              <Spinner>Processing file</Spinner>
            ) : docStatus === `encrypted` ? (
              <InfoAdmonition className="my-4">
                <strong>❌ Cannot open document</strong>
                <p className="leading-snug">
                  This probably means that the document is corrupt, or is encrypted (rather than simply &apos;protected&apos;).
                </p>
              </InfoAdmonition>
            ) : (docStatus === `edit-protected` || docStatus === `edit-protected-loading`) ? (
              <PrimaryButton
                onClick={removeEditProtection}
                loading={docStatus === `edit-protected-loading`}
                loadingComponent={
                  <Spinner>Removing edit protection</Spinner>
                }
              >
                🔓 Remove edit protection
              </PrimaryButton>
            ) : (docStatus === `locked-track-changes` || docStatus === `locked-track-changes-loading`) ? (
              <PrimaryButton
                onClick={unlockTrackChanges}
                loading={docStatus === `locked-track-changes-loading`}
                loadingComponent={
                  <Spinner>Unlocking track changes</Spinner>
                }
              >
                🔓 Unlock track changes
              </PrimaryButton>
            ) : (
              <>
                <InfoAdmonition className="mb-4">
                  <strong>✅ No restrictions</strong>
                  <p className="leading-snug">
                    There do not appear to be any restrictions in this document.
                  </p>
                </InfoAdmonition>
                <PrimaryButton onClick={saveFile}>
                  💾 Save document
                </PrimaryButton>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default View