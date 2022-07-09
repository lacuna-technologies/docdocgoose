import React, { useCallback } from 'react'
import { PrimaryButton } from 'components/button'
import OptimiseButton from 'components/pdf/edit/optimiseButton'

const SectionTitle = ({ children }) => {
  return <strong className="text-sm uppercase">{children}</strong>
}

type Props = {
  numPages: number,
  pageIndex: number,
  rotatePage: (pageIndex: number) => void,
  removeCurrentPage: () => void,
  movePage: (pageIndex: number, newPageIndex: number) => void,
  addBox: () => void,
}

const LeftSideBar: React.FC<Props> = ({
  addBox,
  movePage,
  numPages,
  pageIndex,
  rotatePage,
  removeCurrentPage,
}) => {
  const onClickRotate = useCallback(() => {
    rotatePage(pageIndex)
  }, [pageIndex, rotatePage])

  const onClickDelete = useCallback(() => {
    const confirmDelete = window.confirm(`Are you sure you want to delete page ${pageIndex + 1}?`)
    if(confirmDelete){
      removeCurrentPage()
    }
  }, [pageIndex, removeCurrentPage])

  const onClickMove = useCallback(() => {
    const newPageNumber = window.prompt(`Move page ${pageIndex + 1} to immediately after page (use 0 to make it the first page):`)
    if(newPageNumber){
      const inputNumber = Number.parseInt(newPageNumber)
      const isValidNumber = !Number.isNaN(inputNumber) && inputNumber >= 0 && inputNumber <= numPages
      const newPageIndex = inputNumber > pageIndex ? (inputNumber - 1) : inputNumber
      if(isValidNumber){
        movePage(pageIndex, newPageIndex)
      } else {
        window.alert(`Invalid page number provided`)
      }
    }
  }, [pageIndex, numPages, movePage])

  return (
    <div className="flex flex-none md:flex-col flex-row md:gap-4 gap-2 md:w-72 px-2 md:px-4 pb-4 overflow-auto bg-slate-200">
      <div>
          <SectionTitle>Page</SectionTitle>
          <div className="grid md:grid-cols-2 grid-cols-1 mt-2 md:gap-2 gap-2">
            <PrimaryButton onClick={onClickRotate} title="Rotate the current page clockwise">
              🔃 Rotate
            </PrimaryButton>
            <PrimaryButton onClick={onClickDelete} title="Delete the current page">
              🗑️ Delete
            </PrimaryButton>
            <PrimaryButton onClick={onClickMove} title="Move the current page">
              ↕️ Move
            </PrimaryButton>
          </div>
      </div>

      <div>
        <SectionTitle>Edit Content</SectionTitle>
        <div className="grid md:grid-cols-2 grid-cols-1 mt-2 md:gap-2 gap-2">
          <PrimaryButton>
            ✒️ Text
          </PrimaryButton>
          <PrimaryButton onClick={addBox}>
            ⬜ Box
          </PrimaryButton>
          <PrimaryButton>
            🖼️ Image
          </PrimaryButton>
        </div>
      </div>
      
      <div>
        <SectionTitle>General</SectionTitle>
        <div className="grid grid-cols-1 mt-2 md:gap-4 gap-2">
          <OptimiseButton />
        </div>
      </div>
      
    </div>
  )
}

export default LeftSideBar