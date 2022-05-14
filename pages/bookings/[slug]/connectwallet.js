import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWeb3 } from '@rastaracoon/web3-context';

import { __ } from '../../../utils/helpers';

import Layout from '../../../components/Layout';


const Booking = ({ booking, error }) => {
  const router = useRouter();
  const { address, wallet, onboard } = useWeb3();
  console.log(booking)
  useEffect(() => {
    wallet && router.push(`/bookings/${booking}/checkout`)
  },[wallet])

  return (
    <Layout>
      <Head>
        <title>{ __('blockchain_interstitial_title') }</title>
      </Head>
      <main className="main-content max-w-prose booking min-h-[200px]">
        <h1>{ __('blockchain_interstitial_big_title') }</h1>
        <p>{__('blockchain_interstitial_subtitle')}</p>
        <button
          className="btn-primary w-48 px-4 mt-8"
          onClick={() => {
            onboard?.walletSelect();
          } }
        >
          {__('blockchain_connect_wallet')}
        </button>
      </main>
    </Layout>
  )

}

Booking.getInitialProps = async ({ req, query }) => {
  try {
    return { booking: query.slug } ;
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Booking;