import type { NextPage } from 'next'
import Header from 'components/header'
import Footer from 'components/footer'
import DropZone from 'components/dropzone'

interface Props {
  wasmLoaded: boolean,
}

const Feature = ({ title, content }) => {
  return (
    <li className="mb-4">
      <small className="text-sm uppercase font-bold text-slate-700">{title}</small>
      <p>{content}</p>
    </li>
  )
}

const Home: NextPage<Props> = ({ wasmLoaded }) => {
  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <div className="container max-w-screen-lg mx-auto py-8 grow">
        <div className="flex flex-row">
          <div>
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
          <DropZone />
        </div>
        
      </div>
      <Footer></Footer>
    </div>
    
  )
}

export default Home
