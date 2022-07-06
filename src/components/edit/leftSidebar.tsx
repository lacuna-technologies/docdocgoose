import React, { useCallback } from 'react'
import { PrimaryButton } from 'components/button'
import OptimiseButton from 'components/view/optimiseButton'

const SectionTitle = ({ children }) => {
  return <strong className="text-sm uppercase">{children}</strong>
}

type Props = {
  pageIndex: number,
  rotatePage: (pageIndex: number) => void,
  removeCurrentPage: () => void,
}

const LeftSideBar: React.FC<Props> = ({
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

  return (
    <div className="flex md:flex-col flex-row md:gap-4 gap-2 md:w-72 px-2 md:px-4">
      <div>
          <SectionTitle>Page</SectionTitle>
          <div className="grid md:grid-cols-2 grid-cols-1 mt-2 md:gap-4 gap-2">
          <PrimaryButton onClick={onClickRotate}>
            🔃 Rotate
          </PrimaryButton>
          <PrimaryButton onClick={onClickDelete}>
            🗑️ Delete
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