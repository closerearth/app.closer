import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import EditModel from '../../components/editmodel';
import api from '../../utils/api';
import models from '../../models';

const AddChannel = ({ token }) => {
  const router = useRouter();

  return (
    <Layout protect>
      <Head>
        <title>Create Event</title>
      </Head>
      <div className="main-content intro">
        <EditModel
          endpoint={ '/event' }
          fields={ models.event }
          buttonText="Create Event"
          onSave={ event => router.push(`/events/${event.slug}`) }
        />
      </div>
    </Layout>
  );
}

export default AddChannel;
