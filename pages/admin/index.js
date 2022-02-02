import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import EditModel from '../../components/EditModel';
import Loading from '../../components/Loading';
import api, { formatSearch } from '../../utils/api';
import models from '../../models';
import { useAuth } from '../../contexts/auth';
import PageNotAllowed from '../401';

const Admin = ({ token }) => {

  const { user, isLoading } = useAuth();
  const [email, setInviteEmail] = useState('');
  const [error, setError] = useState(null);
  const [invite, setInvite] = useState(null);

  const inviteUser = async () => {
    try {
      setError(null);
      setInvite(null);
      const res = await api.post('/generate-invite', { email });
      if (res.data.invite_link) {
        setInvite(res.data.invite_link);
        setInviteEmail('');
      } else {
        throw new Error('No invite_url returned.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  if (isLoading) {
    return <Loading />;
  }
  if (!user || !user.roles.includes('admin')) {
    return <PageNotAllowed />;
  }

  return (
    <Layout protect>
      <Head>
        <title>Admin</title>
      </Head>
      <main className="main-content center intro">
        { invite &&
          <div className="success-box">
            Invite link:
            <input value={ invite } className="copy-box" disabled />
          </div>
        }
        { error &&
          <div className="error-box">
            { error }
          </div>
        }
        <form
          onSubmit={(e) => {
            e.preventDefault();
            inviteUser(email);
          }}
          className="card"
        >
          <div className="form-field">
            <label htmlFor="email">Get Invite Link</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="name@awesomeproject.co"
              onChange={e => setInviteEmail(e.target.value)}
              required
            />
          </div>
          <div className="card-footer">
            <div className="action-row">
              <button type="submit" className="button">
                Generate link
              </button>
            </div>
          </div>
        </form>
      </main>
    </Layout>
  );
}

export default Admin;
