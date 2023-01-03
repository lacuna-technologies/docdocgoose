import { PrimaryButton } from "components/button"
import Spinner from "components/spinner"
import { useCallback, useState } from "react"
import Logger from "utils/Logger"
import PdfScout from "utils/PdfScout"

const GenerateBookmarksButton: React.FC = () => {
  
  const [generating, setGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState(null as GeneratedResult)

  const generateBookmarks = useCallback(async () => {
    setGenerating(true)

    try {
      const result = await PdfScout.processFile()
      setGeneratedResult(result)
    } catch (error){
      Logger.error(error)
    } finally {
      setGenerating(false)
    }
  }, [])

  if(generatedResult === null){
    return (
      <PrimaryButton
        onClick={generateBookmarks}
        loading={generating}
        loadingComponent={
          <>
            <Spinner>Generating bookmarks...</Spinner>
          </>
        }
      >
        🔖 Generate bookmarks
      </PrimaryButton>
    )
  }

  return (
    <PrimaryButton href={generatedResult.url} download={generatedResult.fileName}>
      <div className="flex justify-center items-center gap-4">
        <div className="text-2xl">💾</div>
        <div>
          Save generated file
        </div>
      </div>
    </PrimaryButton>
  )
}

export default GenerateBookmarksButton