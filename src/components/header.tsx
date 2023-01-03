import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../public/assets/docdocgoose-logo.png'

const Header = () => {
  return (
    <header className="bg-slate-300">
      <div className="container max-w-screen-lg mx-auto p-4">
        <Link href="/">
          <div className="flex gap-2 items-center cursor-pointer">
            <Image src={Logo} className="w-6" alt="logo"></Image>
            <span className="text-xl font-black no-underline">
              DocDocGoose
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header