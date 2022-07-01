import React, { useCallback, useState } from 'react'
import type { NextPage } from 'next'
import Header from 'components/header'
import Footer from 'components/footer'
import DropZone from 'components/dropzone'
import Storage from 'utils/Storage'
import { useRouter } from 'next/router'
import Spinner from 'components/spinner'

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
  const onDrop = useCallback((files) => {
    setDropped(true)
    Storage.setFile(files[0])
    router.push(`/view`)
  }, [])
  
  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <div className="container max-w-screen-lg mx-auto py-8 grow">
        <div className="flex flex-row">
          <div className="basis-2/3">
            <h2 className="text-3xl font-bold">Edit your document,<br />directly in your browser</h2>
            <ul className="mt-6">
              <Feature
                title="Restrictions"
                content="Remove security, encryption, and other protections from documents, including annoying restrictions on editing or highlighting"
              />
              <Feature
                title="Organise"
                content="Reaarrange, delete, or rotate pages, or merge documents"
              />
              <Feature
                title="Optimise"
                content="Reduce the size of your document"
              />
              <Feature
                title="OCR"
                content="Make the text in your document selectable and highlightable"
              />
            </ul>
          </div>
          {dropped ? (
            <div className="basis-1/3 flex-col justify-center items-center p-4 text-center bg-slate-300">
              <Spinner>Loading...</Spinner>
            </div>
          ) : (
            <DropZone
              onDrop={onDrop}
            />
          )}
          
        </div>
        
      </div>
      <Footer></Footer>
    </div>
    
  )
}

export default Home
