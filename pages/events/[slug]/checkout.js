import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCampground, faBed, faCaravan, faCocktail } from '@fortawesome/free-solid-svg-icons';

import api, { formatSearch, cdn } from '../../../utils/api';
import { priceFormat } from '../../../utils/helpers';
import Layout from '../../../components/Layout';
import CheckoutForm from '../../../components/CheckoutForm';
import PageNotFound from '../../404';
import config from '../../../config';
import { useAuth } from '../../../contexts/auth';

const maxVolunteers = 20;

const stripePromise = loadStripe(config.STRIPE_PUB_KEY);
const optionToIcon = {
  camping: faCampground,
  glamping_quattro: faBed,
  glamping_duo: faBed,
  cocktail: faCocktail,
};
const formatName = name => name && name.split('_').join(' ');

const EventCheckout = ({ event, error }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [ticketOption, setTicketOption] = useState(null);
  const [paymentReceived, setPaymentReceived] = useState(null);
  const [signup, updateSignup] = useState({});
  const [isSignupValid, setSignupValid] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [ticketOptions, setTicketOptions] = useState([]);
  const [volunteerTicketsSold, setVolunteerTicketsSold] = useState(0);
  const now = dayjs();
  const start = event.start && dayjs(event.start);
  const end = event.end && dayjs(event.end);
  const isVolunteer = !!router.query.volunteer && volunteerTicketsSold < maxVolunteers;
  const volunteerCapacityReached = !!router.query.volunteer && volunteerTicketsSold >= maxVolunteers;

  const setField = (field, value) => {
    updateSignup(oldFields => Object.assign({}, signup, { [field]: value }));
    if (field === 'email' && !value.match(/@/gi)) {
      setSignupError('Please enter a valid email');
    } else if (field === 'screenname' && value.length < 3) {
      setSignupError('Please enter a valid name');
    } else if (field === 'password' && value.length < 5) {
      setSignupError('Please enter a valid password (at least 5 characters and include a number)');
    } else if (field === 'repeat_password' && value !== signup.password) {
      setSignupError('Passwords do not match');
    } else {
      setSignupError(null)
    }
  };

  const loadData = async () => {
    try {
      const {
        data: { ticketOptions: availability, volunteerTicketsSold },
      } = await api.get(`/bookings/event/${event._id}/availability`);
      if (JSON.stringify(availability) !== JSON.stringify(ticketOptions)) {
        setTicketOptions(availability);
        setVolunteerTicketsSold(volunteerTicketsSold);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };
  const submitSignupForm = (e) => {
    e.preventDefault();
    if (paymentReceived) {
      register(signup);
    }
  };

  useEffect(() => {
    if (event && event._id) loadData();
    const refreshAvailability = setInterval(loadData, 30000);
    return () => clearInterval(refreshAvailability);
  }, [event]);

  if (error || !event) {
    return <PageNotFound error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>booking</title>
      </Head>
      <div className="main-content intro booking">
        <div className="md:flex md:flex-row justify-start items-start">
          <div className="md:w-1/2 pr-4">
            <h1>{ event.name }</h1>
            { event.start &&
              <p className="text-gray-500 text-sm">
                {start.format('MMM D, YYYY')} at {start.format('HH:mm')} { event.end && <span>until {end.format('MMM D, YYYY')} at {end.format('HH:mm')}</span>}
              </p>
            }
          </div>
          <div className="md:w-1/2">
            { isAuthenticated ?
              <section>
                <h3>Hello {user.screenname}</h3>
                { isVolunteer &&
                  <p className="text-sm">Thank you for being a volunteer!</p>
                }
                { volunteerCapacityReached &&
                  <p className="text-sm">Thank you for applying to be a volunteer, unforturnately volunteer tickets are now sold out.</p>
                }
                <hr className="divide-y divide-gray-400 my-4" />
              </section>:
              <section>
                <p>
                  <h4><i>Already have an account?</i></h4>
                  <Link href="/login"><a className="btn-primary mt-2">Login</a></Link>
                </p>
                <hr className="divide-y divide-gray-400 my-4" />
                <form onSubmit={ e => submitSignupForm(e) }>
                  <fieldset className="w-full mb-4">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                      Full name
                    </label>
                    <input
                      className="w-full"
                      type="text"
                      name="name"
                      id="name"
                      value={signup.screenname}
                      placeholder="John Smith"
                      onChange={e => setField('screenname', e.target.value)}
                      required
                    />
                  </fieldset>
                  <fieldset className="w-full mb-4">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="w-full"
                      type="email"
                      name="email"
                      id="email"
                      value={signup.email}
                      placeholder="name@awesomeproject.co"
                      onChange={e => setField('email', e.target.value)}
                      required
                    />
                  </fieldset>
                  { signupError &&
                    <div className="validation-error">
                      <p>{ String(signupError) }</p>
                    </div>
                  }
                </form>
                <hr className="divide-y divide-gray-400 my-4" />
              </section>
            }
            { ticketOptions && ticketOptions.length > 0 ?
              <section>
                <h3>Ticket options</h3>
                <div className="ticket-options my-4 flex flex-row flex-wrap">
                  {
                    ticketOptions.map(option => (
                      <button
                        key={ option.name }
                        className={`border-2 flex flex-col justify-center rounded-md shadow-lg mr-3 mb-3 p-4 hover:border-primary ${ticketOption && ticketOption.name === option.name ? 'border-primary' : 'border-gray-100'} ${option.available > 0 ? 'available' : 'unavailable'}`}
                        onClick={ () => setTicketOption(option) }
                        disabled={ option.available === 0 }
                      >
                        { optionToIcon[option.name] && <FontAwesomeIcon size="lg" icon={ optionToIcon[option.name] } /> }
                        <h4>{formatName(option.name)}</h4>
                        <p className="price text-gray-500">{ priceFormat(option.price, option.currency) }</p>
                        <p className="availability text-xs uppercase text-primary">
                          { option.available > 0 ? `${option.available} available` : 'not available'}
                        </p>
                      </button>
                    ))
                  }
                </div>
                { ticketOption && <div className="ticket-disclaimer">
                  <p className="text-sm">{ ticketOption.disclaimer }</p>
                </div> }
                <hr className="divide-y divide-gray-400 my-4" />
              </section>:
              <section>

              </section>
            }
            <section>
              <h3>Notes</h3>
              <textarea
                onChange={e => setField('message', e.target.value)}
                value={ signup.message }
                placeholder="Add message for hosts"
              />
              <hr className="divide-y divide-gray-400 my-4" />
            </section>
            { !paymentReceived && <section>
              <h3 className="mb-2">Payment</h3>
              { isVolunteer && <p className="text-sm">Volunteer discount: <b>{ priceFormat(event.volunteerDiscount) }</b></p> }
              { ticketOption &&
                <p className="text-sm mb-3">Total: <b>{ isVolunteer ? priceFormat(Math.max(ticketOption.price.val - event.volunteerDiscount, 0), event.price.cur) : priceFormat(ticketOption.price, event.price.cur) }</b></p>
              }
              { !ticketOption && (!ticketOptions || !ticketOptions.length) &&
                <p className="text-sm">Total: <b>{ isVolunteer ? priceFormat(Math.max(event.price.val - event.volunteerDiscount, 0), event.price.cur) : priceFormat(event.price.val, event.price.cur) }</b></p>
              }
              <p className="text-sm">The ticket is non-refundable, except in case of cancelation.</p>
              <div className="mt-2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    type="event"
                    ticketOption={ ticketOption }
                    _id={ event._id }
                    volunteer={ isVolunteer }
                    onSuccess={ payment => router.push(`/tickets/${payment._id}`) }
                    email={ isAuthenticated ? user.email : signup.email }
                    name={ isAuthenticated ? user.screenname : signup.screenname }
                    message={ signup.message }
                    buttonText="Book"
                    buttonDisabled={ (!isAuthenticated && (!signup.email || !signup.email.match(/@/gi) || signupError)) }
                  />
                </Elements>
              </div>
            </section> }
            { paymentReceived &&
              <div className="success-box">
                Your payment was received!
              </div>
            }
          </div>
        </div>
      </div>
    </Layout>
  );
}
EventCheckout.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: event } } = await api.get(`/event/${query.slug}`);
    return { event };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default EventCheckout;
