import React, { useCallback } from 'react'
import { Page } from 'react-pdf/dist/esm/entry.webpack5'

type Props = {
  pageIndex: number,
  selectPage: (pageIndex: number) => void,
  rotation: number,
  current: boolean
}

const MiniPage: React.FC<Props> = ({ pageIndex, selectPage, rotation, current }) => {
  const onClick = useCallback(() => {
    selectPage(pageIndex)
  }, [pageIndex, selectPage])
  const currentClass = current ? `bg-slate-300` : ``
  const pageNumber = pageIndex + 1

  return (
    <div className={`flex gap-2 p-4 ${currentClass} cursor-pointer`} onClick={onClick}>
      <div className={current ? `text-slate-700` : `text-slate-500`}>
        {pageNumber}
      </div>
      <Page
        className="select-none cursor-pointer"
        pageIndex={pageIndex}
        scale={0.2}
        rotate={rotation}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  )
}

export default MiniPage