import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import BookingListPreview from '../../components/BookingListPreview';
import Tabs from '../../components/Tabs';
import { __ } from '../../utils/helpers';
import PageNotFound from '../404';

const Bookings = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { platform } = usePlatform();
  const [status, setStatus] = useState('open');

  if (!user) {
    return <PageNotFound error="User not logged in." />;
  }


  return (
    <Layout>
      <Head>
        <title>{ __('bookings_title') }</title>
      </Head>

      <div className="main-content intro fullwidth">
        <div className="columns">
          <div className="col lg two-third">
            <div className="page-header">
              <h1>{ __('bookings_title') }</h1>
            </div>
            <div className="bookings-list">
              <Tabs
                tabs={[
                  {
                    title: 'Open',
                    value: 'open',
                    content: (
                      <BookingListPreview status="open" />
                    )
                  },
                  {
                    title: 'Approved',
                    value: 'approved',
                    content: (
                      <BookingListPreview status="conversation" />
                    )
                  },
                  {
                    title: 'Rejected',
                    value: 'rejected',
                    content: (
                      <BookingListPreview status="rejected" />
                    )
                  },
                ]}
                onChange={ tab => setStatus(tab.value) }
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Bookings;
