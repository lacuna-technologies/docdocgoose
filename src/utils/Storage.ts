let memoryStore = {}
let file: File

const get = (key: string) => {
  return memoryStore[key]
}

const set = (key: string, value: any) => {
  memoryStore[key] = value
  return value
}

const setFile = (f: File) => {
  file = f
}
const getFile = (): File => {
  return file
}

const Storage = {
  get,
  getFile,
  set,
  setFile,
}

export default Storage