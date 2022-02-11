import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api, { formatSearch, cdn } from '../../../utils/api';
import PageNotFound from '../../404';
import PageNotAllowed from '../../401';
import config from '../../../config';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';

const Ticket = ({ ticket, event, error }) => {
  const { platform } = usePlatform();
  const { user, isAuthenticated } = useAuth();

  if (!ticket) {
    return <PageNotFound error={ error } />;
  }
  if (!isAuthenticated || ticket.email !== user.email) {
    return <PageNotAllowed error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>Your ticket for {event.name}</title>
        <meta property="og:type" content="ticket" />
      </Head>
      <main className="main-content ticket-page">
        <div className="columns">
          <div className="col lg two-third">
            <div className="ticket card">
              <i>You are going to</i><br/>
              <h2>{ event.name }</h2>
              <h4>Name: {ticket.name}</h4>
              <h4>Ticket number: {ticket._id}</h4>
            </div>
            <br />
            <p>Make sure to check your email address. If you didn&apos;t receive the ticket in your email, add no-reply@mg.oasa.co to your contacts and send us an email to {config.TEAM_EMAIL} for support.</p>
          </div>
          <div className="col third">
          </div>
        </div>
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
