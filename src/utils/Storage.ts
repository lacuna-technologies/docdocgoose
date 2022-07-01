let memoryStore = {}

const get = (key: string) => {
  return memoryStore[key]
}

const set = (key: string, value: any) => {
  memoryStore[key] = value
  return value
}

export interface File extends Blob {
  path: string,
  name: string,
  lastModified: number,
  size: number,
  type: string
}

const FILE_KEY = `SELECTED_FILE`
const setFile = (file: File) => set(FILE_KEY, file)
const getFile = (): File => get(FILE_KEY)

const Storage = {
  get,
  set,
  getFile,
  setFile,
}

export default Storage