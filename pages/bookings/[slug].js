import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api, { formatSearch, cdn } from '../../utils/api';
import PageNotFound from '../404';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';

dayjs.extend(LocalizedFormat);

const Booking = ({ booking, error }) => {

  if (!booking) {
    return <PageNotFound />;
  }

  const start = dayjs(booking.start);
  const end = dayjs(booking.end);

  return (
    <Layout>
      <Head>
        <title>{ booking.name }</title>
        <meta name="description" content={booking.description} />
        <meta property="og:type" content="booking" />
      </Head>
      <main className="fullwidth booking-page">
        <div className="columns">
          <div className="col lg two-third">
            <div className="main-content">
              { error && <div className="validation-error">{error}</div> }
              <section>
                <p>
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a
                          target="_blank"
                          rel="nofollow noreferrer"
                          href={decoratedHref}
                          key={key}
                          onClick={e => e.stopPropagation()}
                        >
                            {decoratedText}
                        </a>
                    )}
                  >
                    {booking.description}
                  </Linkify>
                </p>
              </section>
              <section>
                <h3>Check in:</h3>
                <p><b>{start.format('LLL')}</b></p>
                <h3>Check out:</h3>
                <p><b>{end.format('LLL')}</b></p>
                <p>Booking cost: {booking.price}€</p>
                <p>Directions: <b>Find us on <a target="_blank" rel="noreferrer" href="https://www.google.com/maps/place/Traditional+Dream+Factory/@38.0030022,-8.5613082,17z/data=!3m1!4b1!4m5!3m4!1s0xd1bb5a9aebf4183:0x70f027ce7d295aae!8m2!3d38.002998!4d-8.5591195">Google Maps</a></b></p>
                <p>Any questions? <b>Ask in the <a target="_blank" rel="noreferrer" href="https://chat.whatsapp.com/DnkSxE2x6nM5bOZiPuMpdj">WhatsApp Group</a></b></p>
              </section>
            </div>
          </div>
        </div>
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
