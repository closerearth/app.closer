import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/auth';

const PageNotAllowed = ({ error }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Head>
        <title>No access</title>
      </Head>
      <main  className="main-content about intro page-not-found max-w-prose">
        <h1>No access</h1>
        { error && <h2 className="font-light italic my-4">{ error }</h2> }
        { !isAuthenticated && <p><Link href={`/login?back=${encodeURIComponent(router.asPath)}`}><a className="btn">Sign In</a></Link>.</p> }
      </main>
    </Layout>
  );
}

export default PageNotAllowed;
