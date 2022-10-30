import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { __ } from '../utils/helpers'

const PageNotFound = ({ error }) => (
  <Layout>
    <Head>
      <title>{ __('404_title') }</title>
    </Head>
    <main  className="main-content about intro page-not-found max-w-prose">
      <h1>{ __('404_title') }</h1>
      { error && <h2 className="font-light italic my-4"> { error }</h2> }
      <p><Link href="/" className="btn">{ __('404_go_back') }</Link></p>
    </main>
  </Layout>
);

export default PageNotFound;
