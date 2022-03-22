import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';

import Layout from '../../../components/Layout';

import api, { formatSearch, cdn } from '../../../utils/api';
import PageNotFound from '../../404';
import PageNotAllowed from '../../401';
import config from '../../../config';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';
import polyglot from '../../../locales/base';

const Ticket = ({ ticket, event, error }) => {
  const { platform } = usePlatform();
  const { user, isAuthenticated } = useAuth();

  if (!ticket) {
    return <PageNotFound error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>Your ticket for {event.name}</title>
        <meta property="og:type" content="ticket" />
      </Head>
      <main className="main-content ticket-page flex flex-col justify-center items-center">
        <div className="ticket card flex flex-col md:flex-row justify-center items-center max-w-32">
          <div>
            <QRCode value={ `${config.SEMANTIC_URL}/tickets/${ticket._id}` } />
          </div>
          <div className="md:ml-6">
            <i>You are going to:</i>
            <h2 className="my-3">{ event.name }</h2>
            <p>Ticket holder: <b>{ticket.name}</b></p>
            <p>Ticket number: <b>{ticket._id}</b></p>
          </div>
        </div>
        <br />
        <p>{ polyglot.t('tickets_slug_support_message', { team_email: config.TEAM_EMAIL }) }</p>
      </main>
    </Layout>
  );
}
Ticket.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: ticket } } = await api.get(`/ticket/${query.slug}`);
    const { data: { results: event } } = await api.get(`/event/${ticket.event}`);
    return { ticket, event };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Ticket;
