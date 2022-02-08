import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Tabs from '../../components/Tabs';
import ApplicationList from '../../components/ApplicationList';
import api, { formatSearch } from '../../utils/api';
import PageNotAllowed from '../401';
import models from '../../models';
import { useAuth } from '../../contexts/auth.js';
import { usePlatform } from '../../contexts/platform';

const Applications = ({ token }) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [status, setStatus] = useState('open');
  const openApplications = { where: { status: 'open' } }
  const approvedApplications = { where: { status: 'approved' } }
  const inConversationApplications = { where: { status: 'conversation' } }

  const loadData = async () => {
    await Promise.all([
      platform.application.getCount(openApplications),
      platform.application.getCount(approvedApplications),
      platform.application.getCount(inConversationApplications)
    ]);
  }

  useEffect(() => {
    if (user && user.roles.includes('community-curator')){
      loadData();
    }
  }, [user]);

  if (!user || !user.roles.includes('community-curator')) {
    return <PageNotAllowed />;
  }

  return (
    <Layout protect>
      <Head>
        <title>Community applications</title>
      </Head>
      <main className="main-content">
        <div className="page-header mb-4">
          <div>
            <h1>Community applications</h1>
          </div>
        </div>
        <div className="md:flex md:flex-row-reverse">
          <div className="md:w-1/3 md:ml-4">
            <div className="card">
              <h3 className="card-title">Platform metrics</h3>
              <div className="card-body">
                <p>Open applications: <b>{platform.application.findCount(openApplications)}</b></p>
                <p>In conversation: <b>{platform.application.findCount(inConversationApplications)}</b></p>
                <p>Accepted applications: <b>{platform.application.findCount(approvedApplications)}</b></p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <Tabs
              tabs={[
                {
                  title: 'Open applications',
                  value: 'open'
                },
                {
                  title: 'In conversation',
                  value: 'conversation'
                },
              ]}
              onChange={ tab => setStatus(tab.value) }
            />
            <ApplicationList status={ status } managedBy={ status === 'conversation' && user._id } />
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Applications;
