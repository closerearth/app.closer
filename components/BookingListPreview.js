import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { usePlatform } from '../contexts/platform';
import { useAuth } from '../contexts/auth';

import { __, priceFormat } from '../utils/helpers';

const ListingListPreview = ({ status, limit }) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [page, setPage] = useState(1);
  const [error, setErrors] = useState(false);
  const filter = useMemo(() => ({
    where: { status },
    limit,
    page
  }), [status, limit, page]);

  const bookings = platform.booking.find(filter);


  const loadData = async () => {
    try {
      platform.booking.getCount(filter);
      platform.booking.get(filter);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message)
    }
  };

  useEffect(() => {
    loadData();
  }, [platform, filter]);

  
  return (
    <div className="application-list grid gap-4">
      { bookings && bookings.count() > 0 ?
        bookings.map(book => {
          const booking = platform.booking.findOne(book.get('_id'));
          const start = dayjs(booking.get('start'));
          const end = dayjs(booking.get('end'));

          return (
            <div key={ booking.get('_id') } className="booking-list-preview card">
              <p>{ __('bookings_status') } <b>{booking.get('status')}</b></p>
              <p>{ __('bookings_checkin') } <b>{start.format('LLL')}</b></p>
              <p>{ __('bookings_checkout') } <b>{end.format('LLL')}</b></p>
              <p>{ __('bookings_total') }
                <b className={ booking.get('volunteer') ? 'line-through': '' }>
                  {' '}{priceFormat(booking.get('price'))}
                </b>
                <b>{' '}{booking.get('volunteer') && priceFormat(0, booking.getIn(['price', 'cur']))}</b>
              </p>
              <p>{ __('bookings_id') } <b>{booking.get('_id')}</b></p>
              { booking.get('description') &&
        <p>{ booking.get('description').slice(0, 120) }{ booking.get('description').length > 120 && '...' }</p>
              }
            </div>
          )
        }):
        <p className="py-4">No bookings.</p>
      }

    </div>
  )
};

export default ListingListPreview;
