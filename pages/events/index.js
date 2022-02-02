import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api, { formatSearch } from '../../utils/api';
import UpcomingEvents from '../../components/UpcomingEvents';

import { useAuth } from '../../contexts/auth.js'

const pickColor = () => colors[Math.floor(Math.random() * colors.length)];

const Events = () => {
  const router = useRouter();
  const [error, setErrors] = useState(false);
  const [events, setEvents] = useState([]);
  const urlSearchParams = typeof window !== 'undefined' && new URLSearchParams(window.location.search);
  const params = urlSearchParams && Object.fromEntries(urlSearchParams.entries());
  const page = params && parseFloat(params.page);

  const { user } = useAuth();

  return (
    <Layout>
      <Head>
        <title>Calendar</title>
      </Head>
      { error &&
        <div className="validation-error">{ error }</div>
      }
      <div className="main-content intro">
        <UpcomingEvents
          allowCreate
          limit={ 30 }
          page={ page }
          labelLink={null}
        />
      </div>
    </Layout>
  );
}

export default Events;
