import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import api, { formatSearch } from '../utils/api';
import { usePlatform } from '../contexts/platform';

import ProfilePhoto from './ProfilePhoto';
import Pagination from './Pagination';
import Loading from './Loading';
import { useAuth } from '../contexts/auth.js';

const MemberList = ({
  list,
  card,
  children,
  channel,
  filter,
  title,
  limit
}) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [page, setPage] = useState(1);
  const [error, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const where = Object.assign({}, filter, (channel && {
    category: channel
  }));
  const params = { where, sort_by: 'created', limit, page };
  const users = platform.user.find(params);
  const totalUsers = platform.user.findCount(params);

  const loadData = async () => {
    try {
      await Promise.all([
        platform.user.get(params),
        platform.user.getCount(params)
      ]);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter, channel, page]);

  return (
    <section className={card ? 'card' : ''}>
      { title && <h3 className={card ? 'card-title' : ''}>
        { title }
      </h3> }
      { loading ?
        <Loading />:
        <div className={`user-list ${card?'card-body':''} flex ${list?'flex-col':'flex-row flex-wrap'} justify-start`}>
          { users && users.count() > 0 ?
            users.map(user => (
              <Link key={ user.get('_id') } as={`/members/${user.get('slug')}`} href="/members/[slug]">
                <a className={`user-preview flex flex-row justify-start items-center mb-2 p-2 ${list?'':'w-1/2 md:w-1/5'}`}>
                  <ProfilePhoto user={user.toJS()} size="lg" />
                  <h4 className="font-sm ml-2">{ user.get('screenname') }</h4>
                </a>
              </Link>
            )):
            <p>No members.</p>
          }
        </div>
      }
      <div className="card-footer">
        <Pagination
          loadPage={ (page) => {
            setPage(page);
            loadData();
          }}
          page={ page }
          limit={ limit }
          total={ totalUsers }
          items={ users }
        />
      </div>
    </section>
  )
};
MemberList.defaultProps = {
  limit: 50
}

export default MemberList;
