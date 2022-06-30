export const humanFileSize = (byteCount: number) => {
  const i = Math.floor(
    Math.log(byteCount) / Math.log(1024)
  )
  const num = (byteCount / Math.pow(1024, i)).toFixed(2)
  const unit = ["B", "kB", "MB", "GB", "TB"][i]
  return `${num}${unit}`
}