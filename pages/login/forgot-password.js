import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import api from '../../utils/api'

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);
  const requestPasswordReset = async (email) => {
    try {
      await api.post('/reset-password', { email });
      setResetCompleted(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }

  return (
    <Layout>
      <Head>
        <title>Set password</title>
      </Head>
      <div className="mural">
        <main className="main-content center intro">
          { resetCompleted ?
            <div className="success card">
              <h1>Password reset</h1>
              <p>Please check your email.</p>
            </div>:
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestPasswordReset(email);
              }}
              className="card"
            >
              { error && <div className="validation-error">{ error }</div> }
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  placeholder="you@awesomeproject.org"
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="card-footer">
                <div className="action-row">
                  <button type="submit" className="button">
                    Reset password
                  </button>
                </div>
              </div>
            </form>
          }
        </main>
      </div>
    </Layout>
  );
}

export default ForgotPasswordScreen;
