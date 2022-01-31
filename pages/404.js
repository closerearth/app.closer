import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

const notfound = ({ error }) => (
  <Layout>
    <Head>
      <title>Page not found</title>
    </Head>
    <main  className="main-content about intro page-not-found">
      <h1>Page not found</h1>
      <p>Error: { error }</p>
      <p><Link href="/"><a>Home</a></Link></p>
    </main>
  </Layout>
);

export default notfound;
