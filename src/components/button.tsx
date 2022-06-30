import React from 'react'
import Link from 'next/link'

interface Props {
  children: React.ReactNode,
  href?: string,
  onClick?: () => void,
}

export const PrimaryButton: React.FC<Props> = ({ children, href, onClick }) => {
  const content = (
    <div className="font-light rounded bg-slate-300 px-4 py-2 w-fit cursor-pointer no-underline border border-slate-400 hover:border-slate-500">
      {children}
    </div>
  )
  if(href){
    if(href.slice(0, 1) === `/`){
      return (
        <Link href={href}>{content}</Link>
      )
    } else {
      return (
        <a href={href}>{content}</a>
      )
    }
  } else {
    return (
      <div onClick={onClick}>{content}</div>
    )
  }
}

export const SecondaryButton: React.FC<Props> = ({ children, href, onClick }) => {
  const content = (
    <div className="font-light rounded bg-slate-100 px-4 py-2 w-fit cursor-pointer no-underline border border-slate-400 hover:border-slate-500">
      {children}
    </div>
  )
  if(href){
    if(href.slice(0, 1) === `/`){
      return (
        <Link href={href}>{content}</Link>
      )
    } else {
      return (
        <a href={href}>{content}</a>
      )
    }
  } else {
    return (
      <div onClick={onClick}>{content}</div>
    )
  }
}