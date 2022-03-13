import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import { fromJS } from 'immutable';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DateTimePicker from '../../components/DateTimePicker';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import api from '../../utils/api';
import { priceFormat } from '../../utils/helpers';

dayjs.extend(relativeTime);

const defaultStart = dayjs().add(3, 'days').set('hours', 18).set('seconds', 0).set('minutes', 0).toDate();
const defaultEnd = dayjs().add(6, 'days').set('hours', 11).set('seconds', 0).set('minutes', 0).toDate();

const roundPrice = price => Math.round(price * 100) / 100;
const rates = {
  dailyRate: {
    label: 'night',
    duration: 1
  },
  weeklyRate: {
    label: 'week',
    duration: 7
  },
  monthlyRate: {
    label: 'month',
    duration: 30
  },
};
const formatRate = rate => (rates[rate] || rates.dailyRate).label;

const Book = ({ token }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { platform } = usePlatform();
  const [listings, setListings] = useState([]);
  const [booking, setBooking] = useState({
    start: defaultStart,
    end: defaultEnd,
    rate: 'dailyRate',
    duration: 3
  });
  const updateBooking = async (booking) => {
    setAvailabilityChecked(false);
    setAvailability(false);
    booking.duration = Math.abs(Math.ceil(dayjs(booking.end).diff(booking.start, 'days'))) + 1;
    booking.rate = booking.duration >= 30 ? 'monthlyRate' : booking.duration >= 7 ? 'weeklyRate' : 'dailyRate';
    setBooking(booking);
    loadInventory(booking);
  }
  const [isAvailable, setAvailability] = useState(false);
  const [checkedAvailability, setAvailabilityChecked] = useState(false);

  const getBookingDays = (firstDay, duration) => {
    const start = dayjs(firstDay).set('hours', 0).set('seconds', 0).set('minutes', 0);
    const days = [start];
    if (duration < 1) {
      setAvailability(false);
    }
    for (let i = 1; i <= duration; i++) {
      days.push(start.add(i, 'days').set('hours', 0).set('seconds', 0).set('minutes', 0));
    }
    return days;
  }
  // The +1 is taking into account that checkout time must be before checkin time.
  const duration = Math.abs(Math.ceil(dayjs(booking.end).diff(booking.start, 'days'))) + 1;
  const listing = booking.listing && platform.listing.findOne(booking.listing);
  const createBooking = async (event, listing, booking) => {
    console.log('createBooking', booking)
    event.preventDefault();
    try {
      if (!listing) {
        throw new Error('Please select a listing first.');
      }
      const { data: { results: newBooking } } = await api.post('/bookings/request', {
        start: booking.start,
        end: booking.end,
        listing: listing.get('_id'),
        price: getPrice(listing, booking)
      });

      router.push(`/bookings/${newBooking._id}`);
    } catch (err) {
      console.log(err);
    }
  }
  const getPrice = (listing, booking) => listing.get(booking.rate).get('val')/rates[booking.rate].duration * booking.duration;

  const loadInventory = async (booking) => {
    try {
      const { data: { results: listings } } = await api.post('/booking/availability', booking);
      setListings(listings.map(listing => fromJS(listing)));
    } catch (err) {
      alert(err);
    }
  }

  useEffect(() => {
    if (user && user.roles.includes('admin')){
      loadInventory(booking);
    }
  }, [user]);

  return (
    <Layout protect>
      <Head>
        <title>Book</title>
      </Head>
      <div className="main-content">
        <section className="text-center">
          <h2>Book your stay</h2>
          <form onSubmit={ e => e.preventDefault() }>
            <div className="flex justify-center items-center">
              <fieldset className="mr-3 flex flex-col justify-center items-center">
                <label htmlFor="start">Check in</label>
                <DateTimePicker
                  id="start"
                  value={ booking.start }
                  onChange={start => updateBooking({
                    ...booking,
                    start,
                    end: dayjs(start).set('hours', 11).set('seconds', 0).set('minutes', 0).add(3, 'days').toDate()
                  })}
                  showTime={ false }
                />
              </fieldset>
              <fieldset className="flex flex-col justify-center items-center">
                <label htmlFor="end">Check out</label>
                <DateTimePicker
                  id="end"
                  value={ booking.end }
                  onChange={end => updateBooking({
                    ...booking,
                    end
                  })}
                  showTime={ false }
                />
              </fieldset>
            </div>
            <fieldset className="center-content">
              <label htmlFor="listing">Accomodation type</label>
              <div className="grid grid-cols-3">
                {listings && listings.map(listing => (
                  <div className="card" key={ listing.get('_id') }>
                    <div className="card-header">
                      <h4>{ listing.get('name') }</h4>
                    </div>
                    <div className="card-body">
                      { priceFormat(getPrice(listing, booking), listing.get(booking.rate).get('cur')) }
                    </div>
                    <div className="card-footer">
                      <button className="btn" onClick={ e => createBooking(e, listing, booking) }>
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </Layout>
  );
}

export default Book;
