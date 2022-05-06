import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useWeb3 } from '@rastaracoon/web3-context';
import ReactTooltip from 'react-tooltip';

import PageNotFound from '../../404';
import PageNotAllowed from '../../401';

import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';

import { priceFormat, __ } from '../../../utils/helpers';
import api, { formatSearch, cdn } from '../../../utils/api';
import config from '../../../config';

import Switch from '../../../components/Switch';
import Layout from '../../../components/Layout';
import CheckoutForm from '../../../components/CheckoutForm';

dayjs.extend(LocalizedFormat);

const Booking = ({ booking, error }) => {
  const router = useRouter();
  const [editBooking, setBooking] = useState(booking);
  const stripe = loadStripe(config.STRIPE_TEST_KEY);
  const { isAuthenticated, user } = useAuth();
  const { platform } = usePlatform();
  const { wallet } = useWeb3();
  

  const saveBooking = async (update) => {
    try {
      await platform.booking.patch(booking._id, update);
      router.push(`/bookings/${booking._id}`);
    } catch (err) {
      alert('An error occured.')
      console.log(err);
    }
  };

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
      <ReactTooltip />
      <Head>
        <title>{ booking.name }</title>
        <meta name="description" content={booking.description} />
        <meta property="og:type" content="booking" />
      </Head>
      
      <main className="main-content max-w-prose booking">
        <h1 className="mb-4">
          { __('bookings_checkout_title') }
        </h1>

        <section className="mt-3">
          <h3>{ __('bookings_summary') }</h3>
          <p>{ __('bookings_status') } <b>{editBooking.status}</b></p>
          <p>{ __('bookings_checkin') } <b>{start.format('LLL')}</b></p>
          <p>{ __('bookings_checkout') } <b>{end.format('LLL')}</b></p>
          <p>{ __('bookings_total') }
            <b className={ booking.volunteer || editBooking.usingToken ? 'line-through': '' }>
              {' '}{priceFormat(booking.price)}
            </b>
            <b>{' '}{booking.volunteer || editBooking.usingToken && priceFormat(0, booking.price.cur)}</b>
          </p>
        </section>
        { booking.status === 'open' &&
          <div className="mt-2">
            {booking.volunteer ?
              <div>
                <p>{__('booking_volunteering_details')}</p>
                <p className="mt-3">
                  <a href="#" onClick={e => { e.preventDefault(); saveBooking({ status: 'confirmed' }); } } className="btn-primary">Confirm booking</a>
                </p>
              </div> : 
              <>
                <section className='mt-3'>
                  <div className="mt-2">
                    <div className="flex flex-row items-center space-x-2">
                      <p className="mb-4">{ __('bookings_using_crypto') }</p>
                      <wrap className="" data-tip={!wallet && __('bookings_using_crypto_connect_wallet')}>
                        <Switch checked={editBooking.usingToken} onChange={usingToken => setBooking({ ...editBooking, usingToken })} disabled={!wallet && 'disabled'} />
                      </wrap>
                      <p className='italic text-sm mb-4 cursor-pointer' 
                        data-tip={ __('bookings_using_crypto_interrogation_answer') }
                      >
                        {__('bookings_using_crypto_interrogation')}
                      </p>
                    </div>
                  </div>
                </section>
                {editBooking.usingToken ? 
                  <section className="flex flex-row">
                    <p>You currently have {}tokens staked, and {}nights available to book</p>
                    <button className="btn-primary w-36 px-4"
                      onClick={() => {
                      } }>
                      Approve tokens
                    </button>
                    <button className="btn-primary w-36 px-4"
                      onClick={() => {
                      } }>
                      Complete booking
                    </button>
                  </section>: 
                  <Elements stripe={stripe}>
                    <CheckoutForm
                      type="booking"
                      total={booking.price.val}
                      currency={booking.price.cur}
                      _id={booking._id}
                      onSuccess={payment => setBooking({ ...booking, status: 'confirmed' })}
                      email={user.email}
                      name={user.screenname}
                      message={booking.message}
                      backUrl={`/bookings/${booking._id}/contribution`}
                      buttonText={user.roles.includes('member') ? 'Book' : 'Request to book'}
                      buttonDisabled={false} />
                  </Elements>
                }
              </>}
            {user.roles.includes('member') ?
              <p className="mt-3 text-sm"><i>{__('booking_cancelation_policy_member')}</i></p> :
              <p className="mt-3 text-sm"><i>{__('booking_cancelation_policy')}</i></p>}
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
