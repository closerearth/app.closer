import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';

import Layout from '../../components/Layout';
import MemberHome from '../../components/MemberHome';

import PageNotAllowed from '../401';
import { useAuth } from '../../contexts/auth';
import { __ } from '../../utils/helpers';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return <PageNotAllowed />;
  }

  return (
    <Layout>
      <Head>
        <title>{__('community_title')}</title>
      </Head>
      <MemberHome />
    </Layout>
  );
};

export default Home;
