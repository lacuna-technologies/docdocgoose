/* page that shows after file is selected */
import React, { useEffect, useState } from 'react'
import Header from 'components/header'
import Footer from 'components/footer'
import Storage from 'utils/Storage'

const file = Storage.getFile()

const View = () => {
  useEffect(() => {
    console.log(`file`, file)
  }, [])
  if(file === null){
    return `Loading...`
  }
  return (
    <div className="bg-slate-200 h-screen flex flex-col">
      <Header></Header>
      <Footer></Footer>
    </div>
  )
}

export default View