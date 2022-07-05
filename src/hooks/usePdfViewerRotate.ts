import { useCallback, useEffect, useState } from 'react'

const usePdfViewerRotate = ({ numPages }) => {
  const [rotations, setRotations] = useState([] as number[])
  const rotatePage = useCallback((pageIndex: number) => {
    if(rotations.length > 0){
      const newRotations = [
        ...rotations.slice(0, pageIndex),
        (rotations[pageIndex] + 90) % 360,
        ...rotations.slice(pageIndex + 1),
      ]
      setRotations(newRotations)
    }
  }, [rotations])

  const getRotation = useCallback((pageIndex: number) => {
    return rotations[pageIndex] || 0
  }, [rotations])

  useEffect(() => {
    if(rotations.length === 0 && Number.isInteger(numPages)){
      setRotations(Array.apply(null, Array(numPages)).map(() => 0))
    }
  }, [rotations, numPages])

  return {
    getRotation,
    rotatePage,
    rotations,
    setRotations,
  }
}

export default usePdfViewerRotate