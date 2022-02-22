import React, { useState } from 'react'
import api from '../utils/api'
import Router, { useRouter } from 'next/router';
import { trackEvent } from './Analytics'

const attemptSignup = async (event, request) => {
  event.preventDefault();
  await api.post('/subscribe', request);
}

const Newsletter = ({ tags, placement }) => {
  const [screenname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signupError, setSignupError] = useState(null);
  const didCompleteSignup = Boolean(typeof localStorage !== 'undefined' && localStorage.getItem('signupCompleted'));
  const referrer = typeof localStorage !== 'undefined' && localStorage.getItem('referrer');
  const [signupCompleted, setSignupCompleted] = useState(false);
  const router = useRouter();

  // if (didCompleteSignup) {
  //   return null;
  // }

  return (
    <div className="Newsletter bg-gray-900 py-10 text-white">
      { signupCompleted ?
        <h3>Thanks, we will be in touch soon!</h3> :
        <form
          action="#"
          onSubmit={
            e => attemptSignup(e, { email, screenname, tags: [placement, router.asPath, `ref:${referrer}`] })
              .then(() => {
                trackEvent(placement, 'Lead');
                setSignupCompleted(true);
                localStorage.setItem('signupCompleted', true);
              })
              .catch(err => {
                trackEvent(placement, 'LeadError');
                setSignupError((err.response && err.response.data && err.response.data.error) || err.message);
              })
            }
          className="flex flex-row items-center justify-center"
        >
          { signupError &&
            <div className="error">{ signupError }</div>
          }
          <div className="flex flex-row items-center justify-center px-2">
            <input type="email" className="mr-2" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required />
            <button type="submit" name="subscribe" className="btn-primary text-white">
              Subscribe
            </button>
          </div>
        </form>
      }
    </div>
  );
}

export default Newsletter;
