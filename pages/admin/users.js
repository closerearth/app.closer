import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import UsersTable from '../../components/UsersTable';
import Loading from '../../components/Loading';
import AdminNav from '../../components/AdminNav';
import { useAuth } from '../../contexts/auth';
import PageNotAllowed from '../401';

const Users = () => {

  const { user, isLoading } = useAuth();

  if (!user || !user.roles.includes('admin')) {
    return <PageNotAllowed />;
  }

  return (
    <Layout protect>
      <Head>
        <title>Users</title>
      </Head>
      <main className="main-content center intro">
        <AdminNav activeTab="users" />
        { isLoading ?
          <Loading />:
          <UsersTable />
        }
      </main>
    </Layout>
  );
}

export default Users;
