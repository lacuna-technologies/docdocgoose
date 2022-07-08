import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-300">
      <div className="container max-w-screen-lg mx-auto p-2">
        <div className="flex md:flex-row flex-col justify-center items-center md:gap-x-6 gap-2 text-center text-sm">
          <div>built by <a href="https://huey.xyz">Huey</a></div>
          <div><a href="https://github.com/hueyy/docs-together/">source code</a></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer