import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';

import Layout from '../../../components/Layout';
import EditModel from '../../../components/EditModel';
import models from '../../../models';

import api from '../../../utils/api';

const EditEvent = ({ event }) => {
  const router = useRouter();
  const onUpdate = async (name, value, option, actionType) => {
    if (actionType === 'ADD' && name === 'visibleBy' && option._id) {
      await api.post(`/moderator/event/${event._id}/add`, option);
    }
  }
  if (!event) {
    return <h1>Event not found</h1>;
  }

  return (
    <Layout protect>
      <Head>
        <title>Edit {event.name}</title>
      </Head>
      <div className="main-content">
        <h1 className="flex justify-start items-center">
          <Link as={`/events/${event.slug}`} href="/events/[slug]"><a className="mr-2"><FaArrowLeft /></a></Link>
          Edit event: <i>{ event.name }</i></h1>
        <EditModel
          id={ event._id }
          endpoint="/event"
          fields={ models.event }
          onSave={ event => router.push(`/events/${event.slug}`) }
          onUpdate={ (name, value, option, actionType) => onUpdate(name, value, option, actionType) }
          allowDelete
          deleteButton="Delete Event"
          onDelete={ () => router.push('/') }
        />
      </div>
    </Layout>
  );
}

EditEvent.getInitialProps = async ({ query }) => {
  try {
    if (!query.slug) {
      throw new Error('No event');
    }
    const { data: { results: event } } = await api.get(`/event/${query.slug}`);

    return { event }
  } catch (err) {
    return {
      error: err.message
    };
  }
}

export default EditEvent;
