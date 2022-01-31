import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import TaskList from '../../components/TaskList';
import api, { formatSearch } from '../../utils/api';
import PageNotAllowed from '../401';
import models from '../../models';
import { useAuth } from '../../contexts/auth.js'

const Settings = ({ token }) => {

  const { user } = useAuth();
  
  return (
    <Layout protect>
      <Head>
        <title>Open Tasks</title>
      </Head>
      <main className="main-content intro">
        <div className="page-header">
          <h1>
            Open Tasks
          </h1>
          <div className="user-actions">
            <Link as="/tasks/create" href="/tasks/create"><a className="button">Create</a></Link>
          </div>

        </div>
        <TaskList />
      </main>
    </Layout>
  );
}

export default Settings;
