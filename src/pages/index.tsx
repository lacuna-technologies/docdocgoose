import React, { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Header from 'components/header'
import Footer from 'components/footer'
import DropZone from 'components/dropzone'
import Storage from 'utils/Storage'
import { useRouter } from 'next/router'
import Spinner from 'components/spinner'
import { ContentTypes } from 'utils/Constants'

const Feature = ({ title, content }) => {
  return (
    <li className="mb-4">
      <p className="uppercase font-bold text-slate-700">{title}</p>
      <p className="mt-2">{content}</p>
    </li>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const [dropped, setDropped] = useState(false)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if(acceptedFiles.length !== 1){
      window.alert(`Please select only one file`)
      return
    }

    setDropped(true)

    const file = acceptedFiles[0]
    if([ContentTypes.pdf, ContentTypes.docx].includes(file.type)){
      Storage.setFile(file)
      if(file.type === ContentTypes.pdf){
        router.push(`/pdf/view`)
      } else if (file.type === ContentTypes.docx){
        router.push(`/doc/view`)
      }
    } else {
      return window.alert(`Invalid file type`)
    }
    
  }, [router])

  useEffect(() => {
    router.prefetch(`/pdf/view`)
  }, [router])
  
  return (
    <div className="bg-slate-200 h-full min-h-screen flex flex-col">
      <Header />
      <div className="container max-w-screen-lg mx-auto py-8 px-4 grow">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="basis-3/5">
            <h2 className="text-3xl font-bold">Edit documents<br />directly in your browser</h2>
            <ul className="mt-6 leading-snug">
              <Feature
                title="🔓 Restrictions"
                content="Remove restrictions on editing or highlighting."
              />
              <Feature
                title="📁 Organise"
                content="Rearrange, delete, or rotate pages."
              />
              <Feature
                title="🪄 Optimise"
                content="Reduce the size of your document."
              />
              <Feature
                title="💻 Offline"
                content="All processing happens right here, not on the cloud. Your documents never leave your computer."
              />
            </ul>
          </div>
          {dropped ? (
            <div className="basis-2/5 flex flex-col justify-center items-center p-4 text-center bg-slate-300">
              <Spinner>Loading...</Spinner>
            </div>
          ) : (
            <DropZone className="basis-2/5" onDrop={onDrop} />
          )}
        </div>
      </div>
      <Footer />
    </div>
    
  )
}

export default Home
