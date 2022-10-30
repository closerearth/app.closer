import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ActiveLink from './ActiveLink';
import { trackEvent } from './Analytics';
import api, { formatSearch } from '../utils/api';
import { __ } from '../utils/helpers';

const MemberNav = ({ token, user, children, toggleNav }) => {
  const router = useRouter();
  const [channels, setChannels] = useState(null);
  const [error, setErrors] = useState(false);

  const loadData = async () => {
    try {
      const { data: { results } } = await api.get('/channel');
      setChannels(results);
    } catch (err) {
      setErrors(err.message)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user) {
    return null;
  }

  return ([
    <li className="channel-link" key="community">
      <h3>
        <ActiveLink as="/community" href="/community" onClick={() => toggleNav(false)}>
          { __('member_nav_community') }
        </ActiveLink>
      </h3>
    </li>,
    channels && (channels.map(channel => (
      <li className="channel-link" key={ channel._id }>
        <ActiveLink as={`/channel/${channel.slug}`} href="/channel/[channel]" onClick={() => toggleNav(false)}>
          {channel.name}
        </ActiveLink>
      </li>
    ))),
    error && <li className="validation-error" key="error">
      {error}
    </li>,
    <li className="left-nav-separator" key="sep-2" />,
    // user && user.roles.includes('member') && <li key="articles">
    //   <ActiveLink href="/articles" as="/articles" onClick={() => toggleNav(false)}>
    //     Articles
    //   </ActiveLink>
    // </li>,
    user && user.roles.includes('member') && <li key="events">
      <ActiveLink href="/events" as="/events" onClick={() => toggleNav(false)}>
        { __('member_nav_events') }
      </ActiveLink>
    </li>,
    user && user.roles.includes('member') && <li key="tasks">
      <ActiveLink href="/tasks" as="/tasks" onClick={() => toggleNav(false)}>
        { __('member_nav_tasks') }
      </ActiveLink>
    </li>,
    user && <li key="book">
      <ActiveLink href="/book" as="/book" onClick={() => toggleNav(false)}>
        { __('member_nav_book') }
      </ActiveLink>
    </li>,
    user && (user.roles.includes('community-curator') || user.roles.includes('admin')) && <li key="applications">
      <ActiveLink href="/applications" as="/applications" onClick={() => toggleNav(false)}>
        { __('member_nav_applicatins') }
      </ActiveLink>
    </li>,
    user && user.roles.includes('beta') && <li key="Nests">
      <ActiveLink href="/nests" as="/nests" onClick={() => toggleNav(false)}>
        { __('member_nav_nests') }
      </ActiveLink>
    </li>,
    user && <li key="settings">
      <ActiveLink href="/settings" onClick={() => toggleNav(false)}>
        { __('member_nav_settings') }
      </ActiveLink>
    </li>,
    user && <li key="profile">
      <ActiveLink as={`/members/${user.slug}`} href="/members/[slug]" onClick={() => toggleNav(false)}>
        { __('member_nav_profile') }
      </ActiveLink>
    </li>
  ])
};

export default MemberNav;
