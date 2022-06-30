/* page that shows after file is selected */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from 'components/header'
import Footer from 'components/footer'
import Storage from 'utils/Storage'
import PdfCpu from 'utils/PdfCpu'

const file = Storage.getFile()

const View = ({ wasmLoaded }) => {
  const router = useRouter()
  useEffect(() => {
    if(typeof file === `undefined`){
      router.push(`/`)
    }
    if(wasmLoaded && PdfCpu.go === null){
      console.debug(`go is not yet defined`)
      return
    }
    (async () => {
      const arrayBuffer = await file.arrayBuffer()
      globalThis.fs.writeFile(`/${file.path}`, Buffer.from(arrayBuffer), async (err: any) => {
        if(err){
          throw err
        }
        const result = await PdfCpu.run([`info`, `/${file.path}`])
        console.log(`result`, result)
      })
    })()
  }, [file, wasmLoaded])
  if(file === null){
    return `Loading...`
  }
  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <Footer></Footer>
    </div>
  )
}

export default View