import React from 'react'
import useOptimisePdf from 'hooks/useOptimisePdf'
import { PrimaryButton } from 'components/button'
import Spinner from 'components/spinner'
import { humanFileSize } from 'utils/Utils'
import Storage from 'utils/Storage'

const OptimiseButton: React.FC = () => {
  // TODO: apply saveFile mutations first
  const file = Storage.getFile()
  const {
    optimising,
    optimisedResult,
    optimisePdf,
  } = useOptimisePdf({ file })

  if(optimisedResult === null){
    return (
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
    )
  }

  return (
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

export default OptimiseButton