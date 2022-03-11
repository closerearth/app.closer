import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from './Layout';
import UpcomingEvents from './UpcomingEvents';
import MemberList from './MemberList';
import Post from './Post';
import PostList from './PostList';

import api, { formatSearch, cdn } from '../utils/api';
import { useAuth } from '../contexts/auth.js'

const MemberHome = () => {
  const { user, isLoading } = useAuth();
  const [error, setErrors] = useState(false);
  const [posts, setPosts] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [channelsById, setChannelsById] = useState({});

  const loadData = async () => {
    try {
      const params = { sort_by: '-created', where: formatSearch({ parentType: 'channel' }) };
      const { data: { results: posts } } = await api.get('/post', { params });
      const usersToLoad = posts && posts.map(post => post.createdBy);
      const userParams = { params: { where: formatSearch({ _id: { $in: usersToLoad } }) } };
      const { data: { results: users } } = usersToLoad && await api.get('/user', userParams);
      const channelsToLoad = posts && posts.map(post => post.channel);
      const channelsParams = { params: { where: formatSearch({ _id: { $in: channelsToLoad } }) } };
      const { data: { results: channels } } = channelsParams && await api.get('/channel', channelsParams);
      users && setUsersById(users.reduce((acc, val) => ({ ...acc, [val._id]: val }), {}));
      posts && setPosts(posts);
      channels && setChannelsById(channels.reduce((acc, val) => ({ ...acc, [val._id]: val }), {}));
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.response?.data?.error || err.message)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading || !user) {
    // Wait for user to be loaded in order to allow getting private data
    return <div className="loading">Loading...</div>
  }

  return (
    <main className="main-content w-full">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 md:mr-8">
          <div className="channel">
            <div className="channel-header mb-4">
              <h3>Aloha {user?.screenname || 'you'}!</h3>
            </div>
            <div className="channel-sub-header">
              { user.roles.includes('admin') &&
                <Link href="/channel/create" as="/channel/create">
                  <a>+add-channel</a>
                </Link>
              }
            </div>
            { error && <div className="error-box">{ error }</div> }
            <section>
              <PostList
                allowCreate
              />
            </section>
          </div>
        </div>
        <div className="md:w-2/3">
          {/* Wait for user to be loaded in order to fetch private data */}
          <MemberList
            list
            preview
            card
            title="Members"
            limit={ 3 }
          />
          <UpcomingEvents
            list
            card
            title="Events"
            limit={ 3 }
          />
        </div>
      </div>
    </main>
  );
}

export default MemberHome;
