import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import UpcomingEvents from '../components/UpcomingEvents';

const index = () => (
  <Layout>
    <Head>
      <title>Closer Community</title>
    </Head>
    <main className="homepage">
      <section className="text-center flex flex-column items-center justify-center pb-10">
        <div className="main-content">
          <h1 className="font-9xl">Closer</h1>
          <p className="font-lg">The operating system for regenerative communities</p>
          <p className="mt-4">
            <Link href="/signup"><a className="btn-primary">Create your account</a></Link>
          </p>
        </div>
      </section>
    </main>

  </Layout>
);

export default index;
