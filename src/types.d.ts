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

type FileInfo = {
  pdfVersion?: string,
  pageCount?: number,
  pageSize?: string,
  title?: string,
  author?: string,
  subject?: string,
  pdfProducer?: string,
  contentCreator?: string,
  creationDate?: string,
  modificationDate?: string,
  properties?: string,
  tagged?: boolean,
  hybrid?: boolean,
  linearized?: boolean,
  xrefStreams?: boolean,
  objectStreams?: boolean,
  watermarked?: boolean,
  thumbnails?: boolean,
  acroform?: boolean,
  encrypted?: boolean,
  restricted?: boolean,
  permissions?: string,
}

type ProcessFileResult = {
  url: string,
  fileName: string,
}
