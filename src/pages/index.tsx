import type { NextPage } from 'next'

interface Props {
  wasmLoaded: boolean,
}

const Home: NextPage<Props> = ({ wasmLoaded }) => {
  return (
    <div className="container max-w-screen-lg mx-auto px-4 mt-8 mb-8">
      <h1>I have a:</h1>
      <ul>
        <li>PDF</li>
        <li>DOCX</li>
      </ul>
    </div>
  )
}

export default Home
