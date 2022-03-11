import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/auth';

const SetPasswordScreen = () => {
  const router = useRouter();
  const { completeRegistration, updatePassword, error, isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');
  const [screenname, setName] = useState('');
  const [actionCompleted, setActionCompleted] = useState(false);
  let tokenContent = {};
  if (router.query.signup_token) {
    try {
      tokenContent = JSON.parse(atob(router.query.signup_token.split('.')[1]));
    } catch (err) {
      console.log('Failed to parse token:', err)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Set password</title>
      </Head>
      <div className="mural">
        <main className="main-content center intro">
          { isAuthenticated && router.query.signup_token ?
            <div className="card">
              Please sign out before taking this action.
            </div>:
            actionCompleted?
              <div className="card">
                <p>Your new password was succesfully set, you can now proceed to sign in.</p>
                <div className="action-row">
                  <Link href="/login">
                    <a className="button">Sign in</a>
                  </Link>
                </div>
              </div>:
              (router.query.signup_token || router.query.reset_token) ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (router.query.reset_token) {
                      updatePassword(router.query.reset_token, password, () => setActionCompleted(true));
                    } else if (router.query.signup_token) {
                      completeRegistration(router.query.signup_token, {
                        password,
                        screenname
                      }, () => router.push('/'));
                    }
                  }}
                  className="card"
                >
                  <div className="card-title">
                    <h1>Complete registration</h1>
                  </div>
                  <div className="card-body">
                    { tokenContent && tokenContent.email &&
                    <p className="mb-4"><i>Your login email is <b>{tokenContent.email}</b>.</i></p>
                    }
                    { tokenContent && !tokenContent.screenname &&
                    <div className="form-field">
                      <label htmlFor="screenname">Your name</label>
                      <input
                        type="text"
                        name="screenname"
                        id="screenname"
                        value={screenname}
                        placeholder="John Smith"
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    }
                    <div className="form-field">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        placeholder="#sup3rs3cr3t"
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="action-row">
                      <button type="submit" className="btn-primary">
                      Complete registration
                      </button>
                    </div>
                  </div>
                </form>
              ) :
                <div className="card">No token provided.</div> }
        </main>
      </div>
    </Layout>
  );
}

export default SetPasswordScreen;
