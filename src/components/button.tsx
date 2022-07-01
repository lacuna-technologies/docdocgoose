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

const buttonClasses = `font-light rounded px-4 py-2 no-underline border border-slate-400 hover:border-slate-500 h-full flex items-center justify-center text-center`

export const PrimaryButton: React.FC<Props> = ({
  children,
  href,
  onClick,
  loading = false,
  loadingComponent,
  download,
  className = ``,
}) => {
  const loadingContent = loadingComponent ? loadingComponent : <span>Loading...</span>
  const innerContent = loading ? loadingContent : children
  const cursorClass = loading ? `cursor-not-allowed` : `cursor-pointer`
  const content = (
    <div className={`${buttonClasses} bg-slate-100 ${cursorClass} ${className}`}>
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
  className,
}) => {
  const loadingContent = loadingComponent ? loadingComponent : <span>Loading...</span>
  const innerContent = loading ? loadingContent : children
  const cursorClass = loading ? `cursor-not-allowed` : `cursor-pointer`
  const content = (
    <div className={`${buttonClasses} bg-slate-200 ${cursorClass} ${className}`}>
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