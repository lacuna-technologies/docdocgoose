import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-slate-300">
      <div className="container max-w-screen-lg mx-auto p-4">
        <Link href="/">
          <div className="flex gap-2 items-center cursor-pointer">
            <img src="/assets/docdocgoose-logo.png" className="w-6" />
            <a className="text-xl font-black no-underline">
              DocDocGoose
            </a>
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header