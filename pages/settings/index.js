import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import EditModel from '../../components/editmodel';
import api, { formatSearch } from '../../utils/api';
import models from '../../models';
import { useAuth } from '../../contexts/auth'

const Settings = ({ token }) => {

  const { user } = useAuth();

  return (
    <Layout protect>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="main-content">
        { user && <EditModel
          id={ user._id }
          initialData={ user }
          endpoint={ '/user' }
          fields={ models.user }
          buttonText="Save"
        /> }
      </div>
    </Layout>
  );
}

export default Settings;
