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
      <small className="text-sm uppercase font-bold text-slate-700">{title}</small>
      <p>{content}</p>
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
          <div className="basis-2/3">
            <h2 className="text-3xl font-bold">Edit documents<br />directly in your browser</h2>
            <ul className="mt-6 leading-snug">
              <Feature
                title="Restrictions"
                content="Remove security, encryption, and other protections from documents, including annoying restrictions on editing or highlighting"
              />
              <Feature
                title="Edit"
                content="Add text, images, and other content to your documents (coming soon)"
              />
              <Feature
                title="Organise"
                content="Rearrange, delete, or rotate pages"
              />
              <Feature
                title="Optimise"
                content="Reduce the size of your document"
              />
              <Feature
                title="OCR"
                content="Make the text in your document selectable and highlightable (coming soon)"
              />
            </ul>
          </div>
          {dropped ? (
            <div className="basis-1/3 flex flex-col justify-center items-center p-4 text-center bg-slate-300">
              <Spinner>Loading...</Spinner>
            </div>
          ) : (
            <DropZone onDrop={onDrop} />
          )}
        </div>
      </div>
      <Footer />
    </div>
    
  )
}

export default Home
