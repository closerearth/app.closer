import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ApplicationList from '../../components/ApplicationList';
import api, { formatSearch } from '../../utils/api';
import PageNotAllowed from '../401';
import models from '../../models';
import { useAuth } from '../../contexts/auth.js';
import { usePlatform } from '../../contexts/platform';

const Applications = ({ token }) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
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
    if (user && user.roles.includes('admin')){
      loadData();
    }
  }, [user]);

  if (!user || !user.roles.includes('tdf')) {
    return <PageNotAllowed />;
  }

  return (
    <Layout protect>
      <Head>
        <title>Community applications</title>
      </Head>
      <main className="main-content intro">
        <div className="columns">
          <div className="col lg two-third">
            <div className="page-header">
              <div>
                <h1>Community applications</h1>
                <p>Help grow the community and invite new members. Each applicant should have a conversation with a member, after which if the member sees a good fit the applicant can be added to the whatsapp channel & granted an account on the online community.</p>
                <p>Make sure you have read the pink paper and understand on which values to judge applicants before starting this process.</p>
              </div>
            </div>
            <h2>In conversation</h2>
            <ApplicationList status="conversation" managedBy={ user._id } />
            <h2>Open applications</h2>
            <ApplicationList status="open" />
          </div>
          <div className="col third">
            <div className="card">
              <h3 className="card-title">Platform metrics</h3>
              <div className="card-body">
                <p>Open applications: <b>{platform.application.findCount(openApplications)}</b></p>
                <p>In conversation: <b>{platform.application.findCount(inConversationApplications)}</b></p>
                <p>Accepted applications: <b>{platform.application.findCount(approvedApplications)}</b></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Applications;
