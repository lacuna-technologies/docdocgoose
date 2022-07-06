import React from 'react'
import { SecondaryButton } from 'components/button'

const ZoomButton = (
  { children, onClick = () => {} }:
  { children: React.ReactNode, onClick: () => void }
) => {
  return (
    <div
      className="shrink bg-slate-700 rounded-full w-9 h-9 flex justify-center items-center border border-slate-400 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

type Props = {
  pageIndex: number,
  pageOrder: PageInfo[],
  zoomIn: () => void,
  zoomOut: () => void,
  zoomFullWidth: () => void,
}

const DocumentBottomBar: React.FC<Props> = ({ pageIndex, pageOrder, zoomIn, zoomOut, zoomFullWidth }) => {
  return (
    <div className="flex justify-between items-center md:gap-4 gap-2 md:p-4 p-2">
      <SecondaryButton className="text-sm px-3 py-1">
        ℹ️<span className="hidden md:inline-block">&nbsp;Info</span>
      </SecondaryButton>
      <div>
        {pageIndex + 1} / {pageOrder.length}
      </div>
      <div className="flex gap-3">
        <SecondaryButton className="text-sm px-3 py-1" onClick={zoomFullWidth}>
          Auto
        </SecondaryButton>
        <div className="flex gap-3 font-black text-white text-xl">
          <ZoomButton onClick={zoomIn}>
            +
          </ZoomButton>
          <ZoomButton onClick={zoomOut}>
            -
          </ZoomButton>
        </div>
      </div>
    </div>
  )
}

export default DocumentBottomBar