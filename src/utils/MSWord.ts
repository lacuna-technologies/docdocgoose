import JSZip from 'jszip'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const SETTINGS_PATH = `word/settings.xml`

const isEditProtected = async (arrayBuffer: ArrayBuffer): Promise<boolean> => {
  const zipFile = new JSZip()
  try {
    const { files } = await zipFile.loadAsync(arrayBuffer)
    if(SETTINGS_PATH in files){
      const fileContent = await zipFile.file(SETTINGS_PATH).async(`string`)
      const xmlParser = new XMLParser()
      let settings = xmlParser.parse(fileContent)
      return settings[`w:settings`][`w:writeProtection`] !== undefined
    } else {
      throw new Error(`Invalid word file; word/settings.xml missing or invalid`)
    }
  } catch (error) {
    throw new Error(`Could not open file: ${error}`)
  }
}

const removeEditProtection = async (arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> => {
  const zipFile = new JSZip()
  try {
    const { files } = await zipFile.loadAsync(arrayBuffer)
    if(SETTINGS_PATH in files){
      const fileContent = await zipFile.file(SETTINGS_PATH).async(`string`)
      const xmlParser = new XMLParser({
        allowBooleanAttributes: true,
        ignoreAttributes: false,
        ignoreDeclaration: false,
        ignorePiTags: false,
        preserveOrder: true,
      })
      
      let settings = xmlParser.parse(fileContent)
      // many assumptions are made about the structure of the settings file
      settings = [
        settings[0],
        {
          ...settings[1],
          'w:settings': settings[1][`w:settings`].filter((obj) => !(`w:writeProtection` in obj)),
        },
      ]
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        preserveOrder: true,
        suppressBooleanAttributes: false,
      })
      const newFileContent = builder.build(settings)
      zipFile.file(SETTINGS_PATH, newFileContent)
      return await zipFile.generateAsync({ type: `arraybuffer` })
    } else {
      throw new Error(`Invalid word file; word/settings.xml missing or invalid`)
    }
  } catch (error) {
    throw new Error(`Could not open file: ${error}`)
  }
}

const MSWord = {
  isEditProtected,
  removeEditProtection,
}

export default MSWord