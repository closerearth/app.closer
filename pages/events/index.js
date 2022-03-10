import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import api, { formatSearch } from '../../utils/api';
import UpcomingEvents from '../../components/UpcomingEvents';
import EventsList from '../../components/EventsList';
import { PLATFORM_NAME } from '../../config';
import { useAuth } from '../../contexts/auth.js';

const now = new Date();

const Events = () => {

  const { user } = useAuth();

  return (
    <Layout>
      <Head>
        <title>{PLATFORM_NAME} Events</title>
      </Head>
      <div className="main-content intro">
        <div className="page-title flex justify-between">
          <h1 className="mb-4">Upcoming events</h1>
          <div className="action">
            { user && user.roles.includes('event-creator') &&
              <Link href="/events/create">
                <a className="btn-primary">Create event</a>
              </Link>
            }
          </div>
        </div>
        <EventsList
          limit={ 30 }
          where={{
            end: {
              $gt: now
            },
            visibility: 'public'
          }}
        />
      </div>
      <div className="main-content intro">
        <div className="page-title flex justify-between">
          <h1 className="mb-4">Past events</h1>
        </div>
        <EventsList
          limit={ 30 }
          where={{
            end: {
              $lt: now
            },
            visibility: 'public'
          }}
        />
      </div>
    </Layout>
  );
}

export default Events;
