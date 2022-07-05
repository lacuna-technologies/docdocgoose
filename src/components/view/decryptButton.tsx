import React from 'react'
import useDecryptPdf from 'hooks/useDecryptPdf'
import { PrimaryButton } from 'components/button'
import Spinner from 'components/spinner'
import { FileInfo } from 'utils/PdfCpu'

type Props = {
  file: File,
  fileInfo: FileInfo,
  reloadFile: () => void
}

const DecryptButton: React.FC<Props> = ({ file, fileInfo, reloadFile }) => {
  const {
    decryptPdf,
    decrypting,
    decryptedResult,
  } = useDecryptPdf({ file, reloadFile })

  if(fileInfo.encrypted === false){
    return null
  }

  if(decryptedResult === null) {
    return (
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
    )
  }

  return (
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

export default DecryptButton