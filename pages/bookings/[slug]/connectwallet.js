import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { __ } from '../../../utils/helpers';
import { useConnectWallet, useSetChain } from '../../../utils/blockchain.js'

import Layout from '../../../components/Layout';
import { BLOCKCHAIN_NETWORK_ID } from '../../../config_blockchain';


const Booking = ({ booking, error }) => {
  const router = useRouter();
  const [{ wallet }, connect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();

  useEffect(() => {
    wallet && connectedChain.id === BLOCKCHAIN_NETWORK_ID && router.push(`/bookings/${booking}/checkout`)
  },[wallet, connectedChain ])

  return (
    <Layout>
      <Head>
        <title>{ __('blockchain_interstitial_title') }</title>
      </Head>
      <main className="main-content max-w-prose booking min-h-[200px]">
        <h1>{ __('blockchain_interstitial_big_title') }</h1>
        <p>{__('blockchain_interstitial_subtitle')}</p>

        {!wallet ? 
          <button
            className="btn-primary w-48 px-4 mt-8"
            onClick={() => {
              connect();
            } }
          >
            {__('blockchain_connect_wallet')}
          </button>
          : connectedChain.id !== BLOCKCHAIN_NETWORK_ID && (
            <button
              className="btn-primary w-48 px-4 mt-8"
              onClick={() => {
                setChain({ chainId: BLOCKCHAIN_NETWORK_ID })
              } }
            >
              {__('blockchain_switch_chain')}
            </button>
          )}
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