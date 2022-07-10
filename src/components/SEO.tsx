import React from 'react'
import Head from 'next/head'

const title = `📄 DocDocGoose — Edit documents directly in your browser`
const description = `Remove editing or highlighting restrictions and unlock track changes in your documents. No password required.`
const url = `https://docdocgoose.huey.xyz`

const SEO = () => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta property="og:url" content={url}></meta>
      <meta property="og:type" content="website"></meta>
      <meta property="og:title" content={title}></meta>
      <meta property="og:description" content={description}></meta>
    </Head>
  )
}

export default SEO