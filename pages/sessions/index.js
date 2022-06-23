import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import api from '../../utils/api';

import PageNotFound from '../404';
import PageNotAllowed from '../401';
import SessionListPreview from '../../components/SessionListPreview';
import { __ } from '../../utils/helpers';

const Sessions = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { platform } = usePlatform();
  const sessions = platform.session.find();

  const loadData = async () => {
    await Promise.all([
      platform.session.get()
    ]);
  }

  useEffect(() => {
    if (user && user.roles.includes('admin')){
      loadData();
    }
  }, [user]);

  if (!user || (
    !user.roles.includes('admin') 
  )) {
    return <PageNotAllowed error="You must be the event creator, or an admin or space-host in order to see sessions." />;
  }


  return (
    <Layout>
      <Head>
        <title>Sessions List</title>
      </Head>
      <div className="main-content intro fullwidth">
        <div className="page-header mb-3 flex justify-start">
          <h1 className='mr-10'>Sessions List</h1>
          <Link as={'/sessions/create'} href={'sessions/create'}>
            <a >
              <button className='btn-primary'>Create Session </button>
            </a>
          </Link>
        </div>
        <div className="tickets-list">
          { sessions && sessions.count() > 0 ?
            sessions.map(session => <SessionListPreview key={ session.get('_id') } session={ session } />):
            <p className="p-3 text-2xl card text-center italic">No sessions found.</p>
          }
        </div>
      </div>
    </Layout>
  );
}


export default Sessions;
