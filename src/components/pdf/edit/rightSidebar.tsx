import React from 'react'
import { Document } from 'react-pdf/dist/esm/entry.webpack5'
import MiniPage from 'components/pdf/edit/miniPage'

type Props = {
  file: File,
  pageOrder: PageInfo[],
  pageIndex: number,
  selectPage: (pageIndex: number) => void,
}

const RightSideBar: React.FC<Props> = ({ file, pageOrder, pageIndex, selectPage }) => {
  const numPages = pageOrder.length
  return (
    <Document
        file={file}
        className="flex-none flex-col gap-1 overflow-auto ml-4 hidden md:flex"
      >
        {
          (Array.isArray(pageOrder) && numPages > 0) && (
            pageOrder.map(({ pageNumber, rotation }, index) => {
              return (
                <MiniPage
                  key={`mini-page-${pageNumber}`}
                  current={index === pageIndex}
                  pageIndex={pageNumber - 1}
                  selectPage={selectPage}
                  rotation={rotation}
                />
              )
            })
          )
        }
    </Document>
  )
}

export default RightSideBar