import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import BookingListPreview from '../../components/BookingListPreview';
import { __ } from '../../utils/helpers';
import PageNotFound from '../404';
import HomeModernIcon from '../../components/icons/HomeModernIcon';

const Bookings = () => {
  const { user } = useAuth();
  const { platform } = usePlatform();
  const bookingFilter = user && { where: { createdBy: user._id, status: ['pending', 'confirmed', 'checkedIn'] } };

  const loadData = async () => {
    await Promise.all([
      platform.booking.get(bookingFilter)
    ]);
  }

  useEffect(() => {
    if (user && user._id){
      loadData();
    }
  }, [user]);

  if (!user) {
    return <PageNotFound error="User not logged in." />;
  }

  const bookings = platform.booking.find(bookingFilter);

  return (
    <Layout>
      <Head>
        <title>{ __('bookings_title') }</title>
      </Head>
      { bookings && bookings.get('error') &&
        <div className="validation-error">{ bookings.get('error') }</div>
      }
      <div className="main-content intro fullwidth">
        <div className="columns">
          <div className="col lg two-third">
            <div className="page-header">
              <h1 className="text-[32px] leading-[48px] font-normal border-b border-[#e1e1e1] border-solid pb-2 flex space-x-1 items-center">
                <HomeModernIcon width="32px" height="32px" />
                <span>
                  { __('bookings_title') }
                </span>
              </h1>
            </div>
            <div className="bookings-list">
              { bookings && bookings.count() > 0 ?
                bookings.map(booking => <BookingListPreview key={ booking.get('_id') } booking={ booking } />):
                'No Bookings'
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Bookings;
