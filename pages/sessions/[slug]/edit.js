import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';

import Layout from '../../../components/Layout';
import EditModel from '../../../components/EditModel';
import models from '../../../models';

import api from '../../../utils/api';
import { __ } from '../../../utils/helpers';

const EditSession = ( { session } ) => {
  const router = useRouter();
  const onUpdate = async (name, value, option, actionType) => {
    if (actionType === 'ADD' && name === 'visibleBy' && option._id) {
      await api.post(`/moderator/session/${session._id}/add`, option);
    }
  }
  if (!session) {
    return <h1>{ __('events_slug_edit_error') }</h1>;
  }

  return (
    <Layout protect>
      <Head>
        <title>{ __('sessions_edit_title') } {session.name}</title>
      </Head>
      <div className="main-content">
        <h1 className="flex justify-start items-center mb-10">
          <Link as={'/sessions'} href="/sessions"><a className="mr-2"><FaArrowLeft /></a></Link>
          { __('sessions_edit_title') } <i>{ session.name }</i></h1>
        <EditModel
          id={ session._id }
          endpoint="/session"
          fields={ models.session }
          onSave={ session => router.push(`/sessions/${session.slug}`) }
          onUpdate={ (name, value, option, actionType) => onUpdate(name, value, option, actionType) }
          allowDelete
          deleteButton="Delete Session"
          onDelete={ () => router.push('/') }
        />
      </div>
    </Layout>
  );
}

EditSession.getInitialProps = async ({ query }) => {
  try {
    if (!query.slug) {
      throw new Error('No session');
    }
    const { data: { results: session } } = await api.get(`/session/${query.slug}`);

    return { session }
  } catch (err) {
    return {
      error: err.message
    };
  }
}

export default EditSession;
