import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import EditModel from '../../components/EditModel';
import api from '../../utils/api';
import models from '../../models';

const AddChannel = ({ token }) => {
  const router = useRouter();

  return (
    <Layout protect>
      <Head>
        <title>Create Channel</title>
      </Head>
      <div className="main-content intro">
        <EditModel
          endpoint={ '/channel' }
          fields={ models.channel }
          buttonText="Create Channel"
          onSave={ channel => router.push(`/channel/${channel.slug}`) }
        />
      </div>
    </Layout>
  );
}

export default AddChannel;
