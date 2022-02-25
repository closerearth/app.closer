import React, { useState } from 'react';
import Link from 'next/link';
import Loading from '../Loading';
import api from '../../utils/api';
import { useAuth } from '../../contexts/auth';
import PageNotAllowed from '../../pages/401';

const Dashboard = ({ token }) => {

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
    <div className="admin-dashboard card">
      <div className="flex">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            inviteUser(email);
          }}
          className="mt-8 w-1/2"
        >
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
              <button type="submit" className="btn-primary">
                Generate link
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
