import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

const PageNotFound = ({ error }) => (
  <Layout>
    <Head>
      <title>Page not found</title>
    </Head>
    <main  className="main-content about intro page-not-found max-w-prose">
      <h1>Page not found</h1>
      { error && <h2 className="font-light italic my-4"> { error }</h2> }
      <p><Link href="/"><a className="btn">Take me home</a></Link></p>
    </main>
  </Layout>
);

export default PageNotFound;
