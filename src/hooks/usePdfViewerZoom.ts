import { useState, useCallback } from 'react'

const usePdfViewerZoom = () => {
  // TODO: replace naive zoom levels with some more appropriate levels
  const [zoom, setZoom] = useState(1)
  const zoomIn = useCallback(() => {
    setZoom(z => z + 0.1)
  }, [])
  const zoomOut = useCallback(() => {
    setZoom(z => z - 0.1)
  }, [])

  return {
    zoom,
    zoomIn,
    zoomOut,
  }
}

export default usePdfViewerZoom