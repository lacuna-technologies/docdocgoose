import React from 'react'

interface Props {
  children: React.ReactNode,
}

const Spinner: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex gap-2 items-center select-none">
      <svg className="animate-spin w-4 h-4 text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="black"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      { children }
    </div>
  )
}

export default Spinner