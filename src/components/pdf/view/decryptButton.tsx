import React from 'react'
import useDecryptPdf from 'hooks/useDecryptPdf'
import { PrimaryButton } from 'components/button'
import Spinner from 'components/spinner'
import { ErrorAdmonition } from 'components/admonition'

type Props = {
  file: File,
  fileInfo: FileInfo,
  reloadFile: () => void
}

const DecryptButton: React.FC<Props> = ({ file, fileInfo, reloadFile }) => {
  const {
    error,
    decryptPdf,
    decrypting,
    decryptResult,
  } = useDecryptPdf({ file, fileInfo, reloadFile })

  if(fileInfo.encrypted === false && fileInfo.restricted === false){
    return null
  }

  if(decryptResult === null) {
    return (
      <>
        {error.length > 0 ? (
          <ErrorAdmonition className="my-4">
            <strong>❌ Error</strong>
            <p>{error}</p>
          </ErrorAdmonition>
        ) : null}
        <PrimaryButton
          className="my-4"
          onClick={decryptPdf}
          loading={decrypting}
          loadingComponent={
            <>
              <Spinner>
                {fileInfo.encrypted === true
                  ? `Decrypting...`
                  : `Removing restrictions...`
                }
              </Spinner>
            </>
          }
          title={fileInfo.encrypted === true ? `Decrypt PDF`: `Remove restrictions from PDF`}
        >
          🔓 {fileInfo.encrypted === true ? `Decrypt` : `Remove restrictions`}
        </PrimaryButton>
      </>
    )
  }

  return (
    <PrimaryButton className="my-4" href={decryptResult.url} download={decryptResult.fileName}>
      <div className="flex justify-center items-center gap-4">
        <div className="text-2xl">💾</div>
        <div>
          <p>Save file</p>
        </div>
      </div>
    </PrimaryButton>
  )
}

export default DecryptButton