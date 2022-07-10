import React from 'react'

interface InfoAdmonitionProps {
  className?: string,
  children: React.ReactNode
}

export const InfoAdmonition: React.FC<InfoAdmonitionProps> = ({ children, className = `` }) => {
  return (
    <div className={`p-4 bg-sky-200 rounded select-none ${className}`}>
      {children}
    </div>
  )
}

export const GeneralAdmonition: React.FC<InfoAdmonitionProps> = ({ children, className = `` }) => {
  return (
    <div className={`p-4 bg-slate-300 rounded select-none ${className}`}>
      {children}
    </div>
  )
}