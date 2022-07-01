import React from 'react'
import Link from 'next/link'

interface Props {
  children: React.ReactNode,
  href?: string,
  onClick?: () => void,
  loading?: boolean,
  loadingComponent?: React.ReactElement,
  download?: string,
  className?: string,
}

export const PrimaryButton: React.FC<Props> = ({
  children,
  href,
  onClick,
  loading,
  loadingComponent,
  download,
  className
}) => {
  const loadingContent = loadingComponent ? loadingComponent : <span>Loading...</span>
  const innerContent = loading ? loadingContent : children
  const cursorClass = loading ? `cursor-not-allowed` : `cursor-pointer`
  const content = (
    <div className={`font-light rounded bg-slate-100 px-4 py-2 no-underline border border-slate-400 hover:border-slate-500 ${cursorClass} text-center ${className}`}>
      {innerContent}
    </div>
  )
  if(loading){
    return content
  }
  if(href){
    if(href.slice(0, 1) === `/`){
      return (
        <Link href={href}>{content}</Link>
      )
    } else {
      return (
        <a href={href} className="no-underline" download={download}>{content}</a>
      )
    }
  } else {
    return (
      <div onClick={onClick}>{content}</div>
    )
  }
}

export const SecondaryButton: React.FC<Props> = ({
  children,
  href,
  onClick,
  loading,
  loadingComponent,
  download,
  className
}) => {
  const loadingContent = loadingComponent ? loadingComponent : <span>Loading...</span>
  const innerContent = loading ? loadingContent : children
  const cursorClass = loading ? `cursor-not-allowed` : `cursor-pointer`
  const content = (
    <div className={`font-light rounded bg-slate-200 px-4 py-2 no-underline border border-slate-400 hover:border-slate-500 ${cursorClass} text-center ${className}`}>
      {innerContent}
    </div>
  )
  if(loading){
    return content
  }
  if(href){
    if(href.slice(0, 1) === `/`){
      return (
        <Link href={href}>{content}</Link>
      )
    } else {
      return (
        <a href={href} className="no-underline" download={download}>{content}</a>
      )
    }
  } else {
    return (
      <div onClick={onClick}>{content}</div>
    )
  }
}