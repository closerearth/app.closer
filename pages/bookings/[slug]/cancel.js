import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import PageNotFound from '../../404';
import PageNotAllowed from '../../401';

import { useAuth } from '../../../contexts/auth';

import { __ } from '../../../utils/helpers';
import api from '../../../utils/api';

import Layout from '../../../components/Layout';
import CancelCompleted from '../../../components/CancelCompleted';
import CancelBooking from '../../../components/CancelBooking';

const BookingCancelPage = ({ booking, error }) => {
  const router = useRouter();
  const bookingId = router.query.slug
  const { isAuthenticated } = useAuth()
  const [isCancelCompleted, setCancelCompleted] = useState(false)
  const [policy, setPolicy] = useState(null)
  useEffect(() => {
    const fetchPolicy = async () => {
      const res = await api.get('/bookings/cancelation-policy')
      setPolicy(res.data)
    }
    fetchPolicy()
  }, [])

  if (!booking || error) {
    return <PageNotFound />;
  }

  if (!isAuthenticated) {
    return <PageNotAllowed />
  }

  return (
    <Layout>
      <Head>
        <title>{`${bookingId} ${__('cancel_booking_page_title')}`}</title>
        <meta name="description" content={__('cancel_booking_page_title')} />
        <meta property="og:type" content="booking" />
      </Head>
      {isCancelCompleted 
        ? <CancelCompleted /> 
        : <CancelBooking 
          bookingId={bookingId} 
          policy={policy} 
          setCancelCompleted={setCancelCompleted}
        />
      }
    </Layout>
  );
}

BookingCancelPage.getInitialProps = async ({ query }) => {
  try {
    const { data: { results: booking } } = await api.get(`/booking/${query.slug}`);
    return { booking };
  } catch (err) {
    console.error('Error', err.message);
    return {
      error: err.message
    };
  }
}

export default BookingCancelPage;
