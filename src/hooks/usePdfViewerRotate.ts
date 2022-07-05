import { useCallback, useEffect, useState } from 'react'

const usePdfViewerRotate = ({ numPages }) => {
  const [rotations, setRotations] = useState([] as number[])
  const rotatePage = useCallback((pageNumber: number) => {
    if(rotations.length > 0){
      const newRotations = [
        ...rotations.slice(0, pageNumber - 1),
        (rotations[pageNumber - 1] + 90) % 360,
        ...rotations.slice(pageNumber),
      ]
      setRotations(newRotations)
    }
  }, [rotations])

  const getRotation = useCallback((pageNumber) => {
    return rotations[pageNumber - 1] || 0
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