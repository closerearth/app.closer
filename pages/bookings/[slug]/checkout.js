import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useWeb3 } from '@rastaracoon/web3-context';
import ReactTooltip from 'react-tooltip';
import { utils, BigNumber, Contract } from 'ethers';

import PageNotFound from '../../404';
import PageNotAllowed from '../../401';

import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';

import { priceFormat, __ } from '../../../utils/helpers';
import { BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI } from '../../../utils/blockchain';
import api, { formatSearch, cdn } from '../../../utils/api';
import config, { BLOCKCHAIN_DAO_TOKEN,BLOCKCHAIN_DAO_STAKING_CONTRACT } from '../../../config';

import Switch from '../../../components/Switch';
import Layout from '../../../components/Layout';
import CheckoutForm from '../../../components/CheckoutForm';
import Spinner from '../../../components/Spinner';

dayjs.extend(LocalizedFormat);

const Booking = ({ booking, error }) => {
  const router = useRouter();
  const [editBooking, setBooking] = useState(booking);
  const stripe = loadStripe(config.STRIPE_TEST_KEY);
  const { isAuthenticated, user } = useAuth();
  const { platform } = usePlatform();
  const { address, ethBalance: celoBalance, provider, wallet, onboard, tokens } = useWeb3();
  const [toAddress, setToAddress] = useState('')
  const [amountToSend, setamountToSend] = useState(0)
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [stakedBalances, setStakedBalances] = useState({ balance:0, locked:0, unlocked:0, lockingPeriod:0 })

  const saveBooking = async (update) => {
    try {
      await platform.booking.patch(booking._id, update);
      router.push(`/bookings/${booking._id}`);
    } catch (err) {
      alert('An error occured.')
      console.log(err);
    }
  };

  if (!booking) {
    return <PageNotFound />;
  }

  const start = dayjs(booking.start);
  const end = dayjs(booking.end);

  useEffect(() => {
    async function getStakedTokenData() {

      if(!provider || !address){
        return
      }

      const StakingContract = new Contract(
        BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
        BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
        provider.getUncheckedSigner()
      );
  
      const balance = await StakingContract.balanceOf(address);
      const locked = await StakingContract.lockedAmount(address);
      const unlocked = await StakingContract.unlockedAmount(address);
      const lockindPeriod = await StakingContract.lockingPeriod();
      
      setStakedBalances({ ...stakedBalances, balance, locked, unlocked })
    }
    getStakedTokenData()
  }, [tokens, pendingTransactions])

  const approveDAOTokenForStakingContract = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const DAOToken = tokens[BLOCKCHAIN_DAO_TOKEN.address]

    const { hash } = await DAOToken.approve(
      BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
      BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions(pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const stakeTokens = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const StakingContract = new Contract(
      BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
      BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
      provider.getUncheckedSigner()
    );

    const { hash } = await StakingContract.deposit(BigNumber.from(amountToSend))

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions(pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const unstakeAllTokens = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const StakingContract = new Contract(
      BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
      BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
      provider.getUncheckedSigner()
    );

    const { hash } = await StakingContract.withdraw(BigNumber.from(amountToSend))

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions(pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }


  if (!isAuthenticated) {
    return <PageNotAllowed />
  }

  return (
    <Layout>
      <ReactTooltip />
      {pendingTransactions?.length > 0 && <Spinner fixed />}
      <Head>
        <title>{ booking.name }</title>
        <meta name="description" content={booking.description} />
        <meta property="og:type" content="booking" />
      </Head>
      
      <main className="main-content max-w-prose booking">
        <h1 className="mb-4">
          { __('bookings_checkout_title') }
        </h1>

        <section className="mt-3">
          <h3>{ __('bookings_summary') }</h3>
          <p>{ __('bookings_status') } <b>{editBooking.status}</b></p>
          <p>{ __('bookings_checkin') } <b>{start.format('LLL')}</b></p>
          <p>{ __('bookings_checkout') } <b>{end.format('LLL')}</b></p>
          <p>{ __('bookings_total') }
            <b className={ booking.volunteer || editBooking.usingToken ? 'line-through': '' }>
              {' '}{priceFormat(booking.price)}
            </b>
            <b>{' '}{booking.volunteer || editBooking.usingToken && priceFormat(0, booking.price.cur)}</b>
          </p>
        </section>
        { booking.status === 'open' &&
          <div className="mt-2">
            {booking.volunteer ?
              <div>
                <p>{__('booking_volunteering_details')}</p>
                <p className="mt-3">
                  <a href="#" onClick={e => { e.preventDefault(); saveBooking({ status: 'confirmed' }); } } className="btn-primary">Confirm booking</a>
                </p>
              </div> : 
              <>
                <section className='mt-3'>
                  <div className="mt-2">
                    <div className="flex flex-row items-center space-x-2">
                      <p className="mb-4">{ __('bookings_using_crypto') }</p>
                      <wrap className="" data-tip={!wallet && __('bookings_using_crypto_connect_wallet')}>
                        <Switch checked={editBooking.usingToken} onChange={usingToken => setBooking({ ...editBooking, usingToken })} disabled={!wallet && 'disabled'} />
                      </wrap>
                      <p className='italic text-sm mb-4 cursor-pointer' 
                        data-tip={ __('bookings_using_crypto_interrogation_answer') }
                      >
                        {__('bookings_using_crypto_interrogation')}
                      </p>
                    </div>
                  </div>
                </section>
                {editBooking.usingToken ? 
                  <section className="flex flex-col">
                    <p>You currently have <b>{(stakedBalances.balance/BLOCKCHAIN_DAO_TOKEN.decimals).toFixed(4)} {BLOCKCHAIN_DAO_TOKEN.name}</b> tokens staked{stakedBalances.balance>0 && 'consisting of:'}</p>
                    <p className='flex flex-row'>
                      {stakedBalances.locked>0 && <><b>{(stakedBalances.locked/BLOCKCHAIN_DAO_TOKEN.decimals).toFixed(4)} {BLOCKCHAIN_DAO_TOKEN.name}</b>&nbsp;locked<br/></>}
                    </p>
                    <p className='flex flex-row'>
                      {stakedBalances.unlocked>0 && 
                      <>
                        <b>
                          {(stakedBalances.unlocked/BLOCKCHAIN_DAO_TOKEN.decimals).toFixed(4)} {BLOCKCHAIN_DAO_TOKEN.name}
                        </b>
                        &nbsp;releasable
                        <br/>
                      </>}
                    </p>
                    <p>Locking period is {stakedBalances.lockingPeriod}</p>
                    
                    <div className='flex flex-row items-baseline mt-4'>
                      <div className="w-60 mr-4">
                        <input
                          type="number"
                          value={amountToSend}
                          placeholder="cEUR amount (wei)"
                          onChange={e => setamountToSend(e.target.value)} />
                      </div>
                      <button className="btn-primary w-36 px-4"
                        onClick={async () => {
                          unstakeAllTokens();
                        } }>
                      Withdraw
                      </button>
                      <button className="btn-primary w-36 px-4"
                        onClick={async () => {
                          approveDAOTokenForStakingContract();
                        } }>
                      Approve tokens for staking
                      </button>
                      <button className="btn-primary w-36 px-4"
                        onClick={async () => {
                          stakeTokens();
                        } }>
                      Stake tokens
                      </button>
                    </div>
                  </section>: 
                  <Elements stripe={stripe}>
                    <CheckoutForm
                      type="booking"
                      total={booking.price.val}
                      currency={booking.price.cur}
                      _id={booking._id}
                      onSuccess={payment => setBooking({ ...booking, status: 'confirmed' })}
                      email={user.email}
                      name={user.screenname}
                      message={booking.message}
                      backUrl={`/bookings/${booking._id}/contribution`}
                      buttonText={user.roles.includes('member') ? 'Book' : 'Request to book'}
                      buttonDisabled={false} />
                  </Elements>
                }
              </>}
            {user.roles.includes('member') ?
              <p className="mt-3 text-sm"><i>{__('booking_cancelation_policy_member')}</i></p> :
              <p className="mt-3 text-sm"><i>{__('booking_cancelation_policy')}</i></p>}
          </div>
        }
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
