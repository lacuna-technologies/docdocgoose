import React from 'react'

interface AdmonitionProps {
  className?: string,
  children: React.ReactNode
}

const admonitionClass = `p-4 rounded select-none`

export const InfoAdmonition: React.FC<AdmonitionProps> = ({ children, className = `` }) => {
  return (
    <div className={`bg-sky-200 ${admonitionClass} ${className}`}>
      {children}
    </div>
  )
}

export const GeneralAdmonition: React.FC<AdmonitionProps> = ({ children, className = `` }) => {
  return (
    <div className={`bg-slate-300 ${admonitionClass} ${className}`}>
      {children}
    </div>
  )
}

export const ErrorAdmonition: React.FC<AdmonitionProps> = ({ children, className = `` }) => {
  return (
    <div className={`${admonitionClass} bg-red-200 ${className}`}>
      {children}
    </div>
  )
}