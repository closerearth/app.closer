import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { usePlatform } from '../contexts/platform';
import { useAuth } from '../contexts/auth';

import { __, priceFormat } from '../utils/helpers';

const BookingListPreview = ({ booking }) => {

  if (!booking) {
    return null;
  }


  const updateBooking = async (id, status) => {
    try {
      await platform.booking.patch(id, { status: status });
    } catch (err) {
      console.error(err);
    }
  }

  const start = dayjs(booking.get('start'));
  const end = dayjs(booking.get('end'));

  return (
    <div className="booking-list-preview card">
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
      { booking.get('status') == 'open' &&
      <div>
        <button
          onClick={ (e) => {
            e.preventDefault();
            updateBooking(booking.get('_id'), 'completed');
          }}
          className="btn-primary mr-4"
        >
        Approve
        </button>
        <button
          onClick={ (e) => {
            e.preventDefault();
            updateBooking(booking.get('_id'), 'rejected');
          }}
          className="btn-primary mr-4"
        >
        Reject
        </button>
      </div>


      }
    </div>
  );
}

export default BookingListPreview;
