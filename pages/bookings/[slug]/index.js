import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import PageNotAllowed from '../../401';
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';
import api from '../../../utils/api';
import {
  __,
  getIsBookingCancellable,
  priceFormat,
} from '../../../utils/helpers';

dayjs.extend(LocalizedFormat);

const Booking = ({ booking, error }) => {
  const router = useRouter();
  const [editBooking, setBooking] = useState(booking);
  const { isAuthenticated } = useAuth();
  const { platform } = usePlatform();
  const bookingId = router.query.slug;
  const start = dayjs(booking.start);
  const end = dayjs(booking.end);
  const isBookingCancelable = getIsBookingCancellable(
    booking.start,
    booking.status,
  );

  const saveBooking = async (update) => {
    try {
      await platform.booking.patch(booking._id, update);
      router.push(`/bookings/${booking._id}`);
    } catch (err) {
      alert('An error occured.');
      console.log(err);
    }
  };

  if (!booking) {
    return <PageNotFound />;
  }

  if (!isAuthenticated) {
    return <PageNotAllowed />;
  }

  return (
    <Layout>
      <Head>
        <title>{booking.name}</title>
        <meta name="description" content={booking.description} />
        <meta property="og:type" content="booking" />
      </Head>
      <main className="main-content max-w-prose booking">
        <h1 className="mb-4">{__(`bookings_title_${booking.status}`)}</h1>
        <section className="mt-3">
          <h3>{__('bookings_summary')}</h3>
          <p>
            {__('bookings_status')} <b>{editBooking.status}</b>
          </p>
          <p>
            {__('bookings_checkin')} <b>{start.format('LLL')}</b>
          </p>
          <p>
            {__('bookings_checkout')} <b>{end.format('LLL')}</b>
          </p>
          <p>
            {__('bookings_total')}
            <b className={booking.volunteer ? 'line-through' : ''}>
              {' '}
              {priceFormat(booking.price)}
            </b>
            <b> {booking.volunteer && priceFormat(0, booking.price.cur)}</b>
          </p>
        </section>
        {booking.status === 'confirmed' && (
          <section className="mt-3">{__('bookings_confirmation')}</section>
        )}
        <div className="mt-8">
          <Link passHref href={`/bookings/${bookingId}/cancel`}>
            <a>
              <button
                disabled={!isBookingCancelable}
                className="btn-primary disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
              >
                {__('booking_cancel_button')}
              </button>
            </a>
          </Link>
        </div>
      </main>
    </Layout>
  );
};
Booking.getInitialProps = async ({ query }) => {
  try {
    const {
      data: { results: booking },
    } = await api.get(`/booking/${query.slug}`);
    return { booking };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message,
    };
  }
};

export default Booking;
