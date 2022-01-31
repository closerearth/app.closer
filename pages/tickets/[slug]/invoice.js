import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api, { formatSearch, cdn } from '../../../utils/api';
import { priceFormat } from '../../../utils/helpers';
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';
import { PLATFORM_NAME, PLATFORM_LEGAL_ADDRESS } from '../../../config';

const Ticket = ({ ticket, event, error }) => {
  if (!ticket) {
    return <PageNotFound error={ error } />;
  }

  const { platform } = usePlatform();
  const { user, isAuthenticated } = useAuth();

  return (
    <Layout>
      <Head>
        <title>Invoice {ticket._id}</title>
        <meta property="og:type" content="ticket" />
      </Head>
      <main className="main-content invoice-page">
        <div className="card">
          <h3>Invoice #{ticket._id}</h3>
          <h3>Date: {dayjs(ticket.created).format('LLL')}</h3>
          <div className="columns">
            <div className="from col">
              <b>{ PLATFORM_NAME }</b><br/>
              { PLATFORM_LEGAL_ADDRESS }
            </div>
            <br/>
            <div className="to col">
              <b>{ ticket.name }</b><br/>
              {ticket.company && <p>{ ticket.company }</p>}
              {ticket.vatID && <p>{ ticket.vatID }</p>}
              {ticket.address && <p>{ ticket.address }</p>}
            </div>
          </div>
          <hr />
          <h2>{ event.name }</h2>
          <h4>{priceFormat(ticket.price.val, ticket.price.cur)}</h4>
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
