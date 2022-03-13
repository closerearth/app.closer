import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';
import api from '../../../utils/api';

import PageNotFound from '../../404';
import TicketListPreview from '../../../components/TicketListPreview';

const EventTickets = ({ event }) => {
  const router = useRouter();

  const { user } = useAuth();
  const { platform } = usePlatform();
  const ticketsFilter = { where: { event: event && event._id } };
  const tickets = platform.ticket.find();

  const loadData = async () => {
    await Promise.all([
      platform.ticket.get(ticketsFilter)
    ]);
  }

  useEffect(() => {
    if (user && user.roles.includes('admin')){
      loadData();
    }
  }, [user]);

  if (!user || !user.roles.includes('admin')) {
    return null;
  }
  if (!event) {
    return <PageNotFound error="Event not found" />;
  }

  return (
    <Layout>
      <Head>
        <title>{ event.name } - Tickets</title>
      </Head>
      { tickets && tickets.get('error') &&
        <div className="validation-error">{ tickets.get('error') }</div>
      }
      <div className="main-content intro fullwidth">
        <div className="page-header mb-3 flex justify-between">
          <h1><i>{ event.name }</i> - Tickets</h1>
        </div>
        <div className="tickets-list">
          { tickets && tickets.count() > 0 ?
            tickets.map(listing => <TicketListPreview key={ ticket.get('_id') } ticket={ ticket } />):
            <p className="p-3 text-center italic">No tickets found.</p>
          }
        </div>
      </div>
    </Layout>
  );
}
EventTickets.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: event } } = await api.get(`/event/${query.slug}`);
    return { event };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default EventTickets;
