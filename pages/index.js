import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import UpcomingEvents from '../components/UpcomingEvents';
import { useAuth } from '../contexts/auth';
import { PLATFORM_NAME, DEFAULT_TITLE, REGISTRATION_MODE } from '../config';

const Index = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push('/community')
  }

  return (
    <Layout>
      <Head>
        <title>{ PLATFORM_NAME }</title>
      </Head>
      <main className="homepage">
        <section className="text-center flex flex-column items-center justify-center pb-10">
          <div className="main-content">
            <h1 className="page-title">{ PLATFORM_NAME }</h1>
            <p className="font-lg">{ DEFAULT_TITLE }</p>
            { REGISTRATION_MODE !== 'closed' && <p className="mt-4">
              <Link href="/signup" className="btn-primary">Create your account</Link>
            </p> }
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Index;
