import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import PageNotAllowed from '../401';
import api from '../../utils/api';
import { useAuth } from '../../contexts/auth';
import { __ } from '../../utils/helpers';

import Layout from '../../components/Layout';
import MemberHome from '../../components/MemberHome';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return <PageNotAllowed />
  }

  return (
    <Layout>
      <Head>
        <title>{ __('community_title') }</title>
      </Head>
      <MemberHome />
    </Layout>
  );
}

export default Home
