import Storage from "utils/Storage"

const init = async () => {
}

const processFile = async (): Promise<GeneratedResult> => {
  try {
    const file = Storage.getFile()

    const arrayBuffer = await file.arrayBuffer()
    const filePath = `/${file.name}`

    let pyodide = await loadPyodide()
    pyodide.FS.writeFile(filePath, Buffer.from(arrayBuffer))
    
    const outputFilePath = `${filePath.split(`.pdf`)[0]}-out.pdf`

    await pyodide.loadPackage(`micropip`)
    const micropip = pyodide.pyimport(`micropip`)
    await micropip.install(`pdf-scout`)
    pyodide.runPython(`
      from pdf_scout.app import main
      main("${filePath}", "${outputFilePath}", 4)
    `)

    const outBuffer: Buffer = pyodide.FS.readFile(outputFilePath)
    const blob = new Blob([outBuffer])
    const f = new File([outBuffer], file.name)
    Storage.setFile(f)

    return {
      fileName: outputFilePath.slice(1),
      size: blob.size,
      url: URL.createObjectURL(blob),
    }
  } catch (error) {
    console.error(error)
  }
}

const PdfScout = {
  init,
  processFile,
}

export default PdfScout
