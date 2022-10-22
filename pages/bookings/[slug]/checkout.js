import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs, { isDayjs } from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ReactTooltip from 'react-tooltip';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, Contract } from 'ethers';

import PageNotFound from '../../404';
import PageNotAllowed from '../../401';

import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';

import { priceFormat, __ } from '../../../utils/helpers';
import api, { formatSearch, cdn } from '../../../utils/api';
import config, {  } from '../../../config';
import { getStakedTokenData, getBookedNights, getDAOTokenBalance, isMember, formatBigNumberForDisplay } from '../../../utils/blockchain';
import { BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_DAO_TOKEN, BLOCKCHAIN_DAO_TOKEN_ABI, BLOCKCHAIN_DAO_DIAMOND_ADDRESS, BLOCKCHAIN_DIAMOND_ABI } from '../../../config_blockchain';

import Layout from '../../../components/Layout';
import CheckoutForm from '../../../components/CheckoutForm';
import Spinner from '../../../components/Spinner';

dayjs.extend(LocalizedFormat);
dayjs.extend(dayOfYear)

const Booking = ({ booking, error }) => {
  const router = useRouter();
  const [editBooking, setBooking] = useState(booking);
  const stripe = loadStripe(config.STRIPE_PUB_KEY);
  const { isAuthenticated, user } = useAuth();
  const { platform } = usePlatform();
  
  const { chainId, account, library } = useWeb3React()
  const [isDAOMember, setIsDAOMember] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState([])  //In general the following pendingTransactions state should be moved to the root of the app, and should be used as a dependency by all hooks that read blockchain state
  
  const [canUseTokens, setCanUseTokens] = useState(false) //Used to determine if the user has enough available tokens to use in booking
  const [neededToStake, setNeededToStake] = useState()
  const [pendingProcess, setPendingProcess] = useState(false) //Used when need to make several blockchain transactions in a row
  const [loading, setLoading] = useState(true) //General loading to prevent seeing fallback pre-renders in a glitch while waiting for the data
  const [alreadyBookedDates, setAlreadyBookedDates] = useState(false)

  const processConfirmation = async (update) => {
    try {
      const { data: { results: payment } } = await api.post('/payment', {
        type: 'booking',
        _id: booking._id,
        total: booking.price && booking.price.val,
        currency: booking.price && booking.price.cur,
        email: user.email,
        name: user.screenname,
        message: booking.message,
        volunteer: booking.volunteer
      });
      router.push(`/bookings/${booking._id}`);
    } catch (err) {
      alert('An error occured.')
      console.log(err);
    }
  };

  const start = dayjs(booking.start);
  const end = dayjs(booking.end);
  const bookingYear = start.year();
  let nights = [[bookingYear, dayjs(booking.start).dayOfYear()]]
  for(var i = 1; i < booking.duration; i++) {
    nights = [...nights, [bookingYear,dayjs(booking.start).add(i, 'day').dayOfYear()]]
  }

  useEffect(() => {
    if(!library || !account){
      return
    }

    async function retrieveTokenBalanceAndBookedNights(){
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(account && library) {
        setLoading(true)
        
        const DAOTokenWalletBalance = await getDAOTokenBalance(library, account)
        const staked = await getStakedTokenData(library, account)
        const bookedNights = await getBookedNights(library, account, bookingYear)

        if(nights.map(x => x[1]).filter(day => bookedNights.map(a => a.dayOfYear).includes(day)).length > 0){
          setAlreadyBookedDates(true)
        }
        //We should add here the type of booking, since they might require more than 1 token per night
        const tokensToStake = BigNumber.from(bookedNights.length + nights.length).mul(BigNumber.from(10).pow(BLOCKCHAIN_DAO_TOKEN.decimals)).sub(staked.locked)

        setNeededToStake(tokensToStake);
        setCanUseTokens(tokensToStake.lte(DAOTokenWalletBalance));
        
        setLoading(false)
      }
    }

    async function verifyMembershipAndProceed() {
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return 
      }
      const isItAMember = await isMember(library, account)
      setIsDAOMember(isItAMember)
      isItAMember && retrieveTokenBalanceAndBookedNights()
    }

    verifyMembershipAndProceed()
   
  },[pendingTransactions, pendingProcess, account])

  if(start.year() != end.year()){
    return <div>You cannot yet book accross different years</div>
  }


  //Should be moved to the blockchain functions util, but as a hook? 
  //since we intensively update the local state inside this function
  const verifyDetermineApproveNecessaryTokensStakeAndBook = async () => {
    if(!canUseTokens) {
      throw new Error('User does not have enough tokens to continue')
    }
    if(!library || !account){
      return
    }

    const DAOTokenContract = new Contract(
      BLOCKCHAIN_DAO_TOKEN.address,
      BLOCKCHAIN_DAO_TOKEN_ABI,
      library.getUncheckedSigner()
    );
  
    const Diamond = new Contract(
      BLOCKCHAIN_DAO_DIAMOND_ADDRESS,
      BLOCKCHAIN_DIAMOND_ABI,
      library.getUncheckedSigner()
    );

    setPendingProcess(true)
    //Approve the contract to spend tokens
    if(neededToStake > 0) {
      try {
        const tx1 = await DAOTokenContract.approve(
          BLOCKCHAIN_DAO_DIAMOND_ADDRESS,
          neededToStake
        )
        setPendingTransactions([...pendingTransactions, tx1.hash])
        await tx1.wait();
        console.log(`${tx1.hash} mined`)
        setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx1.hash));
      } catch (error) {
        console.log(error)
        //User rejected transaction
        setPendingProcess(false)
        return
      }
    }

    //Now we can book the nights
    try {
      const tx3 = await Diamond.bookAccommodation(nights)
      setPendingTransactions([...pendingTransactions, tx3.hash])
      await tx3.wait();
      console.log(`${tx3.hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx3.hash));
      setBooking({ ...booking, transactionId: tx3.hash });
      router.push(`/bookings/${booking._id}`)
      setPendingProcess(false)
    } catch (error) {
    //User rejected transaction
      setPendingProcess(false)
      return
    }
  }

  if (!isAuthenticated) {
    return <PageNotAllowed />
  }
  if (!booking) {
    return <PageNotFound />;
  }

  return (
    <Layout>
      <ReactTooltip />
      <Head>
        <title>{ booking.name }</title>
        <meta name="description" content={booking.description} />
        <meta property="og:type" content="booking" />
      </Head>
     
      <main className="main-content max-w-prose booking">
        { alreadyBookedDates ? 
          <>
          You already have a booking at these Dates.<br/>
            <Link
              href="/listings/book"
            >
              <button className="btn-primary px-4">Go back to booking</button>
            </Link>
          </> :
          <><h1 className="mb-4">
            {__('bookings_checkout_title')}
          </h1><section className="mt-3">
            <h3>{__('bookings_summary')}</h3>
            <p>{__('bookings_status')} <b>{editBooking.status}</b></p>
            <p>{__('bookings_checkin')} <b>{start.format('LLL')}</b></p>
            <p>{__('bookings_checkout')} <b>{end.format('LLL')}</b></p>
            <p>{__('bookings_total')}
              <b className={booking.volunteer || canUseTokens ? 'line-through' : ''}>
                {' '}{priceFormat(booking.price)}
              </b>
              <b>{' '}{booking.volunteer || canUseTokens && priceFormat(0, booking.price.cur)}</b>
            </p>
          </section>
          { booking.status === 'open' &&
          <div className="mt-2">
            {account && isDAOMember ? (
              <>
                {loading ?
                  <section>
                    Loading ...
                  </section> :
                  <section>
                    {!canUseTokens ? (
                      <h4>
                    You do not have enough tokens to book {booking.duration} nights, please acquire some more tokens.
                      </h4>
                    ) : (
                      <section>
                        <h4>You have enough tokens available to book right away.</h4>
                        {neededToStake.gt(0) && <p>You need to stake {formatBigNumberForDisplay(neededToStake, BLOCKCHAIN_DAO_TOKEN.decimals)} tokens, this will be done for you in the following transactions.</p>}
                        <p>Staked tokens will be blocked until your booking last day + one year. You can cancel your booking to release your tokens.</p>
                        <button
                          className="btn-primary px-4"
                          disabled={pendingProcess}
                          onClick={async () => {
                            verifyDetermineApproveNecessaryTokensStakeAndBook();
                          } }>
                          {pendingProcess ? <div className='flex flex-row items-center'><Spinner /><p className='font-x-small ml-4 text-neutral-300'>Approve all transactions and wait</p></div> : 'Book using tokens'}
                        </button>
                      </section>
                    )}
                  </section>
                }
              </>
            ) : (
              <>
                {booking.volunteer ?
                  <div>
                    <p>{ __('booking_volunteering_details') }</p>
                    <p className="mt-3">
                      <a href="#" onClick={ e => { e.preventDefault(); processConfirmation(); } } className="btn-primary">
                    Confirm booking
                      </a>
                    </p>
                  </div> :
                  <>
                    <Elements stripe={ stripe }>
                      <CheckoutForm
                        type="booking"
                        total={ booking.price.val }
                        currency={ booking.price.cur }
                        _id={ booking._id }
                        onSuccess={ payment => { setBooking({ ...booking, status: 'confirmed' }); router.push(`/bookings/${booking._id}`); } }
                        email={ user.email }
                        name={ user.screenname }
                        message={ booking.message }
                        cancelUrl={ `/bookings/${booking._id}/contribution` }
                        buttonText={ user.roles.includes('member') ? 'Book' : 'Request to book' }
                        buttonDisabled={ false }
                      />
                    </Elements>

                  </>}
              </>
            )}
            {user.roles.includes('member') ?
              <p className="mt-3 text-sm"><i>{__('booking_cancelation_policy_member')}</i></p> :
              <p className="mt-3 text-sm"><i>{__('booking_cancelation_policy')}</i></p>
            }
          </div>
          }
          </>
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
