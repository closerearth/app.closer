import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Tabs from '../../components/Tabs';
import UsersTable from '../../components/UsersTable';
import Dashboard from '../../components/admin/Dashboard';
import api, { formatSearch } from '../../utils/api';
import models from '../../models';
import { useAuth } from '../../contexts/auth';
import PageNotAllowed from '../401';

const Admin = ({ token }) => {
  const { user, isLoading } = useAuth();
  const [email, setInviteEmail] = useState('');
  const [error, setError] = useState(null);
  const [invite, setInvite] = useState(null);

  const inviteUser = async () => {
    try {
      setError(null);
      setInvite(null);
      const res = await api.post('/generate-invite', { email });
      if (res.data.invite_link) {
        setInvite(res.data.invite_link);
        setInviteEmail('');
      } else {
        throw new Error('No invite_url returned.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  if (isLoading) {
    return <Loading />;
  }
  if (!user || !user.roles.includes('admin')) {
    return <PageNotAllowed />;
  }

  return (
    <Layout protect>
      <Head>
        <title>Admin</title>
      </Head>
      <main className="main-content center intro">
        <Tabs
          tabs={ [
            {
              title: 'Dashboard',
              value: 'dashboard',
              content: <Dashboard />
            },
            {
              title: 'Users',
              value: 'users',
              content: <UsersTable />
            },
          ] }
        />
      </main>
    </Layout>
  );
}

export default Admin;
