import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import api, { formatSearch } from '../utils/api';

import ProfilePhoto from './ProfilePhoto';
import Loading from './Loading';
import { useAuth } from '../contexts/auth.js';

const MemberList = ({ children, channel, filter, title }) => {

  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const [error, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const where = filter || (channel && {
        category: channel
      });
      const params = { where: where && formatSearch(where), sort_by: 'created', limit: 200 };
      const [
        { data: { results: users1 } },
        { data: { results: users2 } },
        { data: { results: users3 } },
      ] = await Promise.all([
        api.get('/user', { params: Object.assign({}, params, { page: 1 }) }),
        api.get('/user', { params: Object.assign({}, params, { page: 2 }) }),
        api.get('/user', { params: Object.assign({}, params, { page: 3 }) }),
      ])
      setUsers([].concat(users1, users2, users3));
      setLoading(false);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message)
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter, channel]);


  return (
    <section className="member-page card">
      <h3 className="card-title">
        { title || 'Members' }
      </h3>
      { loading ?
        <Loading />:
        <div className="user-list">
          { users && users.length > 0 ?
            users.map(user => (
              <Link key={ user._id } as={`/members/${user.slug}`} href="/members/[slug]">
                <a className="user-preview">
                  <ProfilePhoto user={user} size="lg" />
                  <h4>{ user.screenname }</h4>
                </a>
              </Link>
            )):
            <p>No members.</p>
          }
        </div>
      }
    </section>
  )
};

export default MemberList;
