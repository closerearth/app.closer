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
import { BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_ABI, BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI } from '../../../utils/blockchain';
import api, { formatSearch, cdn } from '../../../utils/api';
import config, { BLOCKCHAIN_DAO_TOKEN,BLOCKCHAIN_DAO_STAKING_CONTRACT, BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_CONTRACT } from '../../../config';

import Switch from '../../../components/Switch';
import Layout from '../../../components/Layout';
import CheckoutForm from '../../../components/CheckoutForm';
import Spinner from '../../../components/Spinner';

dayjs.extend(LocalizedFormat);

const Booking = ({ booking, error }) => {
  const router = useRouter();
  const [editBooking, setBooking] = useState(booking);
  const stripe = loadStripe(config.STRIPE_PUB_KEY);
  const { isAuthenticated, user } = useAuth();
  const { platform } = usePlatform();
  const { address, ethBalance: celoBalance, provider, wallet, onboard, tokens, isReady } = useWeb3();
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [stakedBalances, setStakedBalances] = useState({ balance:0, locked:0, unlocked:0, lockingPeriod:0, depositsFor: [] })
  const [bookedNights, setBookedNights] = useState([])
  const [canUseTokens, setCanUseTokens] = useState(false) //Used to determine if the user has enough available tokens to use in booking
  const [pendingProcess, setPendingProcess] = useState(false) //Used when need to make several blockchain transactions in a row
  const [loading, setLoading] = useState(true) //General loading to prevent seeing fallback pre-renders in a glitch while waiting for the data

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
      setLoading(true)

      const StakingContract = new Contract(
        BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
        BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
        provider.getUncheckedSigner()
      );
  
      const balance = await StakingContract.balanceOf(address)/(10**BLOCKCHAIN_DAO_TOKEN.decimals);
      const locked = await StakingContract.lockedAmount(address)/(10**BLOCKCHAIN_DAO_TOKEN.decimals);
      const unlocked = await StakingContract.unlockedAmount(address)/(10**BLOCKCHAIN_DAO_TOKEN.decimals);
      const depositsFor = await StakingContract.depositsFor(address);
      const lockindPeriod = await StakingContract.lockingPeriod();
      
      setStakedBalances({ ...stakedBalances, balance, locked, unlocked, lockindPeriod, depositsFor })
      setCanUseTokens(tokens[BLOCKCHAIN_DAO_TOKEN.address]?.balance + unlocked >= booking.duration)
    }
    getStakedTokenData()
    setLoading(false)
  }, [tokens, pendingTransactions, pendingProcess])

  useEffect(() => {
    async function getBookedNights() {
      if(!provider || !address){
        return
      }
      setLoading(true)

      const ProofOfPresenceContract = new Contract(
        BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_CONTRACT.address,
        BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_ABI,
        provider.getUncheckedSigner()
      );
      
      const bookedNights = await ProofOfPresenceContract.getDates(address);
      setBookedNights(bookedNights)
    }
    getBookedNights()
    setLoading(false)
  }, [tokens, pendingTransactions, pendingProcess])

  const approveDAOTokenForStakingContract = async () => {
    const DAOToken = tokens[BLOCKCHAIN_DAO_TOKEN.address]

    const { hash } = await DAOToken.approve(
      BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
      BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const stakeTokens = async () => {
    const StakingContract = new Contract(
      BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
      BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
      provider.getUncheckedSigner()
    );

    const { hash } = await StakingContract.deposit(BigNumber.from(amountToSend))

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const verifyDetermineApproveStakeNecessaryTokensAndBook = async () => {
    if(!canUseTokens) {
      throw new Error('User does not have enough tokens to continue')
    }
    if(!provider || !address){
      return
    }

    const DAOToken = tokens[BLOCKCHAIN_DAO_TOKEN.address]
    const StakingContract = new Contract(
      BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
      BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
      provider.getUncheckedSigner()
    );
    const ProofOfPresenceContract = new Contract(
      BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_CONTRACT.address,
      BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_ABI,
      provider.getUncheckedSigner()
    ); 

    setPendingProcess(true)

    //Calculate how many tokens we need to stake and stake them.

    const neededToStake = utils.parseUnits(booking.duration.toString(), BLOCKCHAIN_DAO_TOKEN.decimals).sub(utils.parseUnits(stakedBalances.unlocked.toString(),  BLOCKCHAIN_DAO_TOKEN.decimals))  ;
    
    if(neededToStake) {
      try {
        const tx1 = await DAOToken.approve(
          BLOCKCHAIN_DAO_STAKING_CONTRACT.address,
          BigNumber.from(neededToStake)
        )
        setPendingTransactions([...pendingTransactions, tx1.hash])
        await tx1.wait();
        console.log(`${tx1.hash} mined`)
        setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx1.hash));
      } catch (error) {
      //User rejected transaction
        setPendingProcess(false)
        return
      }
    
      try {
        const tx2 = await StakingContract.deposit(BigNumber.from(neededToStake))
        setPendingTransactions([...pendingTransactions, tx2.hash])
        await tx2.wait();
        console.log(`${tx2.hash} mined`)
        setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx2.hash));
      } catch (error) {
      //User rejected transaction
        setPendingProcess(false)
        return
      }
    }

    //Now we can book the nights
    const nights = []
    try {
      const tx3 = await ProofOfPresenceContract.book(nights)
      setPendingTransactions([...pendingTransactions, tx3.hash])
      await tx3.wait();
      console.log(`${tx3.hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx3.hash));
      saveBooking({ status: 'confirmed', transactionId: tx3.hash });
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

  return (
    <Layout>
      <ReactTooltip />
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
            <b className={ booking.volunteer || canUseTokens ? 'line-through': '' }>
              {' '}{priceFormat(booking.price)}
            </b>
            <b>{' '}{booking.volunteer || canUseTokens && priceFormat(0, booking.price.cur)}</b>
          </p>
        </section>
        <button onClick={() => {console.log(booking)}}>
          Test
        </button>
        { booking.status === 'open' &&
          <div className="mt-2">
            {wallet ? (
              <>
                {loading ? 
                  <section>
                    Loading ...
                  </section> : 
                  <section>
                    <div className='flex flex-row justify-end mb-8'>
                      <div className='flex flex-column'>
                        <b>Token balances:</b>
                        <ul>
                          <li>
                          Wallet: {tokens[BLOCKCHAIN_DAO_TOKEN.address]?.balance.toFixed(0)}
                          </li>
                          <li>
                          Staked: {stakedBalances.locked}
                           For: {stakedBalances.depositsFor.map((el) => <li className='ml-2' key={el.timestamp.toString()}>{el.timestamp.toString()}</li>
                            )}
                          </li>
                          <li>
                          Releasable: {stakedBalances.unlocked}
                          </li>
                        </ul>
                      </div>
                      <div className='flex flex-column'>
                        <b>Booked nights:</b>
                        <ul>
                          {bookedNights.map((el) => <li className='ml-2' key={el.toString()}>{el.toString()}</li>)}
                        </ul>
                      </div>
                    </div>
                    {!canUseTokens ? (
                      <h4>
                    You do not have enough tokens to book {booking.duration} nights, please acquire some more tokens.
                      </h4>
                    ) : (
                      <section>
                        { stakedBalances.unlocked >= booking.duration ?
                          <h4>You have enough releasable tokens in staking to re-use right away.</h4>
                          : 
                          <h4>You need to add tokens to your staking to continue</h4> 
                        }
                        <p>Staked tokens will be blocked until your booking last day + one year. You can cancel your booking at anytime to release your tokens.</p> 
                        <button 
                          className="btn-primary px-4"
                          disabled={pendingProcess}
                          onClick={async () => {
                            verifyDetermineApproveStakeNecessaryTokensAndBook();
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
