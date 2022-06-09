import type { NextPage } from 'next'

interface Props {
  wasmLoaded: boolean,
}

const Home: NextPage<Props> = ({ wasmLoaded }) => {
  return (
    <div>
      <h1>Sup world</h1>
      <p>{JSON.stringify(wasmLoaded)}</p>
    </div>
  )
}

export default Home
