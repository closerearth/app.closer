import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Slider from '../../components/Slider';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import api from '../../utils/api';

dayjs.extend(relativeTime);

const defaultStart = dayjs().add(3, 'days').set('hours', 18).set('seconds', 0).set('minutes', 0).toDate();
const defaultEnd = dayjs().add(6, 'days').set('hours', 11).set('seconds', 0).set('minutes', 0).toDate();

const roundPrice = price => Math.round(price * 100) / 100;

const Book = ({ token }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { platform } = usePlatform();
  const listings = platform.listing.find();
  const [booking, setBooking] = useState({
    message: '',
    listing: (listings && listings.first().get('_id')),
    start: defaultStart,
    end: defaultEnd,
    price: 0
  });
  const updateBooking = (booking) => {
    setAvailabilityChecked(false);
    setAvailability(false);
    setBooking(booking);
  }
  const [isAvailable, setAvailability] = useState(false);
  const [checkedAvailability, setAvailabilityChecked] = useState(false);
  const checkAvailability = async (firstDay, duration) => {
    const start = dayjs(firstDay).set('hours', 0).set('seconds', 0).set('minutes', 0);
    const days = [start];
    if (duration < 1) {
      setAvailability(false);
    }
    for (let i = 1; i <= duration; i++) {
      days.push(start.add(i, 'days').set('hours', 0).set('seconds', 0).set('minutes', 0));
    }
    // const availability = await Promise.all(days.map(day => (
    //   platform.booking.getCount({ where: {
    //     listing: listing.get('_id'),
    //     start: { $gt: day.toDate() },
    //     end: { $lt: day.add(1, 'day').toDate() }
    //   } })
    // )));
    // const isAvailableForDates = availability.every(action => action.results < listing.get('quantity'));
    const action = await api.post('/bookings/availability', booking);
    console.log(action);
    // setAvailability(isAvailableForDates);
    // setAvailabilityChecked(true);
  };
  // The +1 is taking into account that checkout time must be before checkin time.
  const duration = Math.abs(Math.ceil(dayjs(booking.end).diff(booking.start, 'days'))) + 1;
  const calculatePrice = (listingPrice=0,duration=0) => {
    const discountFactor = duration >= 30 ? 0.5 : duration >= 7 ? .625 : 1;
    return roundPrice(listingPrice * duration * discountFactor);
  }
  const listing = booking.listing && platform.listing.findOne(booking.listing);
  const totalPrice = listing && calculatePrice(listing.get('price'), duration);
  const submit = async (event) => {
    event.preventDefault();
    try {
      if (!listing) {
        throw new Error('Please select a listing first.');
      }
      booking.description = `Booking at Traditional Dream Factory, with ${listing.get('name')}.`;
      booking.price = calculatePrice(listing.get('price'), duration);
      const action = await api.post('/bookings/request', booking);

      console.log(action)

      // const action = await platform.booking.post(booking);
      // router.push(`/bookings/${action.results.get('_id')}`);
    } catch (err) {
      alert(err.message);
    }
  }

  const loadData = async () => {
    await Promise.all([
      platform.listing.get()
    ]);
  }

  useEffect(() => {
    if (user && user.roles.includes('admin')){
      loadData();
    }
  }, [user]);

  return (
    <Layout protect>
      <Head>
        <title>Book</title>
      </Head>
      <div className="main-content">
        <section className="text-center">
          <h2>Book your stay at Traditional Dream Factory!</h2>
          <Slider
            slides={[
              {
                image: '/images/locations/traditionaldreamfactory/1.jpeg',
                label: 'The Tranditional Dream Factory, Alentejo',
                text: ''
              },
              {
                image: '/images/locations/traditionaldreamfactory/2.jpeg',
                label: 'Coworking',
                text: ''
              },
              {
                image: '/images/locations/traditionaldreamfactory/3.jpeg',
                label: 'Set in protected oak lands',
                text: ''
              },
              {
                image: '/images/locations/traditionaldreamfactory/4.jpeg',
                label: 'Bring your van',
                text: ''
              },
              {
                image: '/images/locations/traditionaldreamfactory/5.jpeg',
                label: '100Mb internet connection',
                text: ''
              },
              {
                image: '/images/locations/traditionaldreamfactory/6.jpeg',
                label: 'Creative space',
                text: ''
              },
            ]}
          />
          <form onSubmit={ e => submit(e) }>
            <div className="columns horizontal-center">
              <fieldset>
                <label htmlFor="start">Check in</label>
                <DatePicker
                  id="start"
                  selected={ booking.start }
                  onChange={start => updateBooking({
                    ...booking,
                    start,
                    end: dayjs(start).set('hours', 11).set('seconds', 0).set('minutes', 0).add(3, 'days').toDate()
                  })}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={30}
                  dateFormat="Pp"
                />
              </fieldset>
              &nbsp;&nbsp;
              <fieldset>
                <label htmlFor="end">Check out</label>
                <DatePicker
                  id="end"
                  selected={ booking.end }
                  onChange={end => updateBooking({ ...booking, end })}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={30}
                  dateFormat="Pp"
                />
              </fieldset>
            </div>
            <fieldset className="center-content">
              <label htmlFor="listing">Accomodation type</label>
              <select
                id="listing"
                className="size-md"
                value={ booking.listing || (listings && listings.count() > 0 && listings.first().get('_id')) }
                onChange={e => updateBooking({ ...booking, listing: e.target.value })}
              >
              {listings && listings.map(listing => (
                <option value={ listing.get('_id') } key={ listing.get('_id') }>
                  { listing.get('name') }
                </option>
              ))}
              </select>
            </fieldset>
            <fieldset className="center-content">
              <label htmlFor="message">Send a message to your hosts in Abela</label>
              <textarea
                id="message"
                className="size-md"
                value={ booking.message }
                onChange={e => updateBooking({ ...booking, message: e.target.value })}
              />
            </fieldset>
            { listing &&
              <div className="description">
                <p>{ `Booking at Traditional Dream Factory, with ${listing.get('name')}.` }</p>
                <p>{listing.get('description')} ({listing.get('quantity')} units available)</p>
                <p>{duration} nights stay - <b>{totalPrice}€</b> ({roundPrice(totalPrice/duration)}€/night)</p>
                { isAvailable && <p>Your stay is available!</p> }
              </div>
            }
            <fieldset>
              { checkedAvailability && isAvailable && <button type="submit">Book now</button> }
              { checkedAvailability && !isAvailable && <p>The requested days are not available</p> }
              { !checkedAvailability && listing &&
                <button
                  onClick={ (e) => {
                    e.preventDefault();
                    checkAvailability(booking.start, duration);
                  }}
                >
                  Check availability
                </button>
              }
            </fieldset>
          </form>
        </section>
      </div>
    </Layout>
  );
}

export default Book;
