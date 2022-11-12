import Head from 'next/head';
import Link from 'next/link';

import React, { useEffect, useRef, useState } from 'react';

import Layout from '../../components/Layout';
import TaskList from '../../components/TaskList';

import axios from 'axios';

import PageNotAllowed from '../401';
import { useAuth } from '../../contexts/auth.js';
import models from '../../models';
import api, { formatSearch } from '../../utils/api';
import { __ } from '../../utils/helpers';

const Settings = ({ token }) => {
  const { user } = useAuth();

  return (
    <Layout protect>
      <Head>
        <title>{__('tasks_title')}</title>
      </Head>
      <main className="main-content intro">
        <div className="page-header">
          <h1>{__('tasks_title')}</h1>
          <div className="user-actions">
            <Link as="/tasks/create" href="/tasks/create">
              <a className="button">{__('tasks_link_create')}</a>
            </Link>
          </div>
        </div>
        <TaskList />
      </main>
    </Layout>
  );
};

export default Settings;
