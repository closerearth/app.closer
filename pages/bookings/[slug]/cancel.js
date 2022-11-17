import Head from 'next/head';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';

import CancelBooking from '../../../components/CancelBooking';
import CancelCompleted from '../../../components/CancelCompleted';
import Layout from '../../../components/Layout';

import PageNotAllowed from '../../401';
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import api from '../../../utils/api';
import { __, getIsBookingCancellable } from '../../../utils/helpers';

const BookingCancelPage = ({ booking, error }) => {
  const router = useRouter();
  const bookingId = router.query.slug;
  const { isAuthenticated, user } = useAuth();
  const isMember = user?.roles.includes('member');
  const [policy, setPolicy] = useState(null);
  const [isPolicyLoading, setPolicyLoading] = useState(false);
  const [isCancelCompleted, setCancelCompleted] = useState(false);
  const isBookingCancelable = getIsBookingCancellable(
    booking.start,
    booking.status,
  );

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setPolicyLoading(true);
        const { data } = await api.get('/bookings/cancelation-policy');
        setPolicy(data);
      } catch (error) {
        console.log(error);
      } finally {
        setPolicyLoading(false);
      }
    };
    if (user) {
      fetchPolicy();
    }
  }, [user]);

  if (!booking || error) {
    return <PageNotFound />;
  }

  if (!isAuthenticated) {
    return <PageNotAllowed />;
  }

  if (!isBookingCancelable) {
    return (
      <div className="main-content max-w-prose pb-16">
        <h1 className="text-[32px] leading-[48px] font-normal border-b border-[#e1e1e1] border-solid pb-2">
          <span className="text-red-500">X </span>
          <span>{__('booking_is_not_cancellable')}</span>
        </h1>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{`${bookingId} ${__('cancel_booking_page_title')}`}</title>
        <meta name="description" content={__('cancel_booking_page_title')} />
        <meta property="og:type" content="booking" />
      </Head>
      {isCancelCompleted ? (
        <CancelCompleted />
      ) : (
        <CancelBooking
          booking={booking}
          bookingId={bookingId}
          policy={policy}
          isMember={isMember}
          isPolicyLoading={isPolicyLoading}
          setCancelCompleted={setCancelCompleted}
        />
      )}
    </Layout>
  );
};

BookingCancelPage.getInitialProps = async ({ query }) => {
  try {
    const {
      data: { results: booking },
    } = await api.get(`/booking/${query.slug}`);
    return { booking };
  } catch (err) {
    console.error('Error', err.message);
    return {
      error: err.message,
    };
  }
};

export default BookingCancelPage;
