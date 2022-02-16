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

import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MemberList = ({ children, channel, filter, title, limit }) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [page, setPage] = useState(1);
  const [error, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const where = filter || (channel && {
    category: channel
  });
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
    <section className="member-page">
      <Link href={"/"}>
      <button className='flex flex-row justify-evenly items-center w-28 h-6 self-start rounded-full border border-neutral-900 text-xs'>
      <FontAwesomeIcon icon={faLongArrowAltLeft} className='w-10/12' />
         go back
      </button>
      </Link>
      <h3 className="mt-4 mb-12 text-4xl font-light">
        { title || 'Community members' }
      </h3>
      { loading ?
        <Loading />:
        <div className="grid gap-4 md:grid-cols-2 justify-start items-center">
          { users && users.count() > 0 ?
            users.map(user => (
              <Link key={ user.get('_id') } as={`/members/${user.get('slug')}`} href="/members/[slug]">
                <div className="flex flex-col justify-start items-center p-5 w-12/12 max-w-md md:max-w-xl md:w-11/12 border border-zinc-400 rounded-sm">
                  <div className='flex flex-row items-center justify-between w-full'>
                  <h4 className="font-light text-2xl md:text-2xl">{ user.get('screenname') }</h4>
                  <ProfilePhoto user={user.toJS()} width={"12"} height={"12"}/>
                  </div>
                  <p className='mb-3 w-10/12 self-start text-zinc-400 text-sm'>Lorem ipsum dolor sit amet, consectetur adipscing elit, sed do eiusmod tempor incididunt t labore et dolore.</p>
                  <h4 className="text-xs flex self-start mb-3">{user.get('timezone')}</h4>
                  <button className='w-full md:w-52 self-start rounded-full border border-neutral-900 h-9'>See profile</button>
                </div>
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
