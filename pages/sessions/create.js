import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import EditModel from '../../components/EditModel';
import api from '../../utils/api';
import models from '../../models';
import { __ } from '../../utils/helpers';

const CreateSession = ({ token }) => {
  const router = useRouter();

  return (
    <Layout protect>
      <Head>
        <title>{ __('sessions_create_title') }</title>
      </Head>
      <div className="main-content intro">
        <EditModel
          endpoint={ '/session' }
          fields={ models.session }
          buttonText="Create Session"
          onSave={ session => router.push(`/sessions/${session.slug}`) }
        />
      </div>
    </Layout>
  );
}

export default CreateSession;
