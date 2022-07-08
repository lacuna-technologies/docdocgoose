import JSZip from 'jszip'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import type { X2jOptionsOptional, XmlBuilderOptionsOptional } from 'fast-xml-parser'

const SETTINGS_PATH = `word/settings.xml`
const quickParseOptions: X2jOptionsOptional = {}
const losslessParseOptions: X2jOptionsOptional = {
  allowBooleanAttributes: true,
  ignoreAttributes: false,
  ignoreDeclaration: false,
  ignorePiTags: false,
  preserveOrder: true,
}
const losslessBuildOptions: XmlBuilderOptionsOptional = {
    ignoreAttributes: false,
    preserveOrder: true,
    suppressBooleanAttributes: false,
  }

const getSettingsFile = async (arrayBuffer: ArrayBuffer, options: X2jOptionsOptional) => {
  const zipFile = new JSZip()
  try {
    const { files } = await zipFile.loadAsync(arrayBuffer)
    if(SETTINGS_PATH in files){
      const fileContent = await zipFile.file(SETTINGS_PATH).async(`string`)
      const xmlParser = new XMLParser(options)
      const settings = xmlParser.parse(fileContent)
      return { settings, zipFile }
    } else {
      throw new Error(`Invalid word file; word/settings.xml missing or invalid`)
    }
  } catch (error) {
    throw new Error(`Could not open file: ${error}`)
  }
}

const writeSettingsFile = async (zipFile: JSZip, newSettings: any): Promise<ArrayBuffer> => {
  const builder = new XMLBuilder(losslessBuildOptions)
  const newFileContent = builder.build(newSettings)
  zipFile.file(SETTINGS_PATH, newFileContent)
  return zipFile.generateAsync({ type: `arraybuffer` })
}

const isEditProtected = async (arrayBuffer: ArrayBuffer): Promise<boolean> => {
  const { settings } = await getSettingsFile(arrayBuffer, quickParseOptions)
  return settings[`w:settings`][`w:writeProtection`] !== undefined
}

const removeEditProtection = async (arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> => {
  const { zipFile, settings } = await getSettingsFile(arrayBuffer, losslessParseOptions)
  // many assumptions are made about the structure of the settings file
  const newSettings = [
    settings[0],
    {
      ...settings[1],
      'w:settings': settings[1][`w:settings`].filter((obj) => !(`w:writeProtection` in obj)),
    },
  ]
  return writeSettingsFile(zipFile, newSettings)
}

const isTrackChangesLocked = async (arrayBuffer: ArrayBuffer): Promise<boolean> =>{
  const { settings } = await getSettingsFile(arrayBuffer, quickParseOptions)
  return settings[`w:settings`][`w:documentProtection`] !== undefined
}

const unlockTrackChanges = async (arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> => {
  const { zipFile, settings } = await getSettingsFile(arrayBuffer, losslessParseOptions)
  const newSettings = [
    settings[0],
    {
      ...settings[1],
      'w:settings': settings[1][`w:settings`].filter((obj) => !(`w:documentProtection` in obj)),
    },
  ]
  return writeSettingsFile(zipFile, newSettings)
}

const MSWord = {
  isEditProtected,
  isTrackChangesLocked,
  removeEditProtection,
  unlockTrackChanges,
}

export default MSWord