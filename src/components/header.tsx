import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-slate-300">
      <div className="container max-w-screen-lg mx-auto p-4">
        <Link href="/">
          <a className="text-xl font-black no-underline">
            DocsTogether
          </a>
        </Link>
      </div>
    </header>
  )
}

export default Header