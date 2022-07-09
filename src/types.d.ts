declare var Go: any // TO FIX
declare var fs: any

type PageInfo = {
  rotation: number,
  pageNumber: number,
  width: number,
  originalHeight: number,
  height: number,
  originalWidth: number,
}

type EditableObject = {
  id: string,
  selected: boolean
}

type EditableBox = EditableObject & {
  type: `box`,
  size: {
    height: number,
    width: number,
  },
  position: {
    x: number,
    y: number,
  },
} 

type EditableContent = EditableBox