import React from 'react'

type Props = {
  children: React.ReactNode,
}

const FileAttribute: React.FC<Props> = ({ children }) => {
  return (
    <small className="after:ml-2 after:content-['·'] last-of-type:after:content-[''] last-of-type:after:ml-0">
      {children}
    </small>
  )
}

export default FileAttribute