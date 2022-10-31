import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import api, { formatSearch } from '../../utils/api';
import UpcomingEvents from '../../components/UpcomingEvents';
import EventsList from '../../components/EventsList';
import { PLATFORM_NAME, PERMISSIONS } from '../../config';
import { useAuth } from '../../contexts/auth.js';
import { __ } from '../../utils/helpers';

const now = new Date();

const Events = () => {

  const { user } = useAuth();

  return (
    <Layout>
      <Head>
        <title>{PLATFORM_NAME} { __('events_title') }</title>
      </Head>
      <div className="main-content intro">
        <div className="page-title flex justify-between">
          <h1 className="mb-4">{ __('events_upcoming') }</h1>
          <div className="action">
            { user && (!PERMISSIONS || !PERMISSIONS.event.create || user.roles.includes(PERMISSIONS.event.create)) &&
              <Link href="/events/create" className="btn-primary" legacyBehavior>
                { __('events_link') }
              </Link>
            }
          </div>
        </div>
        <EventsList
          limit={ 30 }
          where={{
            end: {
              $gt: now
            }
          }}
        />
      </div>
      <div className="main-content intro">
        <div className="page-title flex justify-between">
          <h1 className="mb-4">{ __('events_past') }</h1>
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
