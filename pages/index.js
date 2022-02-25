import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import UpcomingEvents from '../components/UpcomingEvents';
import { useAuth } from '../contexts/auth';

const index = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push('/community')
  }

  return (
    <Layout>
      <Head>
        <title>Closer Community</title>
      </Head>
      <main className="homepage">
        <section className="text-center flex flex-column items-center justify-center pb-10">
          <div className="main-content">
            <h1 className="page-title">Closer</h1>
            <p className="font-lg">The operating system for sovereign communities</p>
            <p className="mt-4">
              <Link href="/signup"><a className="btn-primary">Create your account</a></Link>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default index;
