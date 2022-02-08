import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import MemberList from '../../components/MemberList';
import api, { formatSearch } from '../../utils/api';
import { useAuth } from '../../contexts/auth.js'
import PageNotAllowed from '../401'

const Settings = ({ token }) => {

  const { user } = useAuth();

  if (!user) {
    return <PageNotAllowed />
  }

  return (
    <Layout protect>
      <Head>
        <title>Members</title>
      </Head>
      <div className="main-content fullheight">
        <MemberList />
      </div>
    </Layout>
  );
}

export default Settings;
