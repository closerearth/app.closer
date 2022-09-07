import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import UpcomingEvents from '../components/UpcomingEvents';
import { useAuth } from '../contexts/auth';
import { PLATFORM_NAME, DEFAULT_TITLE, REGISTRATION_MODE } from '../config';

import { useWeb3React } from '@web3-react/core'


const Index = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push('/community')
  }

  const { account } = useWeb3React()

  return (
    <Layout>
      <Head>
        <title>{ PLATFORM_NAME }</title>
      </Head>
      <main className="homepage">
        {account}
      </main>
    </Layout>
  );
}

export default Index;
