import { useCallback, useEffect, useState } from 'react'

const usePdfViewerRotate = ({ pageNumber, numPages }) => {
  const [rotations, setRotations] = useState([] as number[])
  const rotatePage = useCallback(() => {
    if(rotations.length > 0){
      const newRotations = [
        ...rotations.slice(0, pageNumber - 1),
        (rotations[pageNumber - 1] + 90) % 360,
        ...rotations.slice(pageNumber),
      ]
      setRotations(newRotations)
    }
  }, [rotations, pageNumber])

  useEffect(() => {
    if(rotations.length === 0 && Number.isInteger(numPages)){
      setRotations(Array.apply(null, Array(numPages)).map(() => 0))
    }
  }, [rotations, numPages])

  return {
    rotatePage,
    rotations,
    setRotations,
  }
}

export default usePdfViewerRotate