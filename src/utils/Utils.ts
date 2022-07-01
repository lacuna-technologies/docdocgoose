export const humanFileSize = (byteCount: number) => {
  const i = Math.floor(
    Math.log(byteCount) / Math.log(1024)
  )
  const num = (byteCount / Math.pow(1024, i)).toFixed(2)
  const unit = ["B", "kB", "MB", "GB", "TB"][i]
  return `${num}${unit}`
}

export const downloadBlob = (blob: Blob, fileName) => {
  const link = document.createElement(`a`)
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
}