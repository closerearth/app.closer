import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PageNotFound from '../404';
import PageNotAllowed from '../401';

import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';

import { priceFormat, __ } from '../../utils/helpers';
import api, { formatSearch, cdn } from '../../utils/api';
import config from '../../config';


import Layout from '../../components/Layout';
import CheckoutForm from '../../components/CheckoutForm';

dayjs.extend(LocalizedFormat);

const Booking = ({ booking, error }) => {
  const [editBooking, setBooking] = useState(booking);
  const stripe = loadStripe(config.STRIPE_TEST_KEY);
  const { isAuthenticated, user } = useAuth();

  if (!booking) {
    return <PageNotFound />;
  }

  const start = dayjs(booking.start);
  const end = dayjs(booking.end);

  if (!isAuthenticated) {
    return <PageNotAllowed />
  }

  return (
    <Layout>
      <Head>
        <title>{ booking.name }</title>
        <meta name="description" content={booking.description} />
        <meta property="og:type" content="booking" />
      </Head>
      <main className="main-content max-w-prose booking">
        <h1 className="mb-4">
          { __('bookings_slug_title') }
        </h1>
        { booking.status === 'open' &&
          <div>
            <section>
              <h3>{ __('bookings_slug_notes') }</h3>
              <textarea
                onChange={e => setBooking({ ...editBooking, message: e.target.value })}
                value={ editBooking.message }
                placeholder="Add message for hosts"
              />
            </section>
          </div>
        }
        <section className="mt-3">
          <h3>{ __('bookings_slug_summary') }</h3>
          <p>{ __('bookings_slug_status') } <b>{editBooking.status}</b></p>
          <p>{ __('bookings_slug_checkin') } <b>{start.format('LLL')}</b></p>
          <p>{ __('bookings_slug_checkout') } <b>{end.format('LLL')}</b></p>
          <p>{ __('bookings_slug_total') } <b>{priceFormat(booking.price)}</b></p>
        </section>
        { booking.status === 'open' &&
          <div className="mt-2">
            { user.roles.includes('member') ?
              <p className="mb-3 text-sm"><i>{ __('booking_cancelation_policy_member') }</i></p>:
              <p className="mb-3 text-sm"><i>{ __('booking_cancelation_policy') }</i></p>
            }
            <Elements stripe={ stripe }>
              <CheckoutForm
                type="booking"
                total={ booking.price.val }
                currency={ booking.price.cur }
                _id={ booking._id }
                onSuccess={ payment => setBooking({ ...booking, status: 'confirmed' }) }
                email={ user.email }
                name={ user.screenname }
                message={ booking.message }
                buttonText={ user.roles.includes('member') ? 'Book' : 'Request to book' }
                buttonDisabled={ false }
              />
            </Elements>
          </div>
        }
      </main>
    </Layout>
  );
}
Booking.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: booking } } = await api.get(`/booking/${query.slug}`);
    return { booking };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Booking;
