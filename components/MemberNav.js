import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ActiveLink from './ActiveLink';
import { trackEvent } from './Analytics';
import api, { formatSearch } from '../utils/api';

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
        <ActiveLink as="/community" href="/community">
          <a onClick={() => toggleNav(false)}>Community</a>
        </ActiveLink>
      </h3>
    </li>,
    channels && (channels.map(channel => (
      <li className="channel-link" key={ channel._id }>
        <ActiveLink as={`/channel/${channel.slug}`} href="/channel/[channel]">
          <a onClick={() => toggleNav(false)}>{channel.name}</a>
        </ActiveLink>
      </li>
    ))),
    error && <li className="validation-error" key="error">
      {error}
    </li>,
    <li className="left-nav-separator" key="sep-2" />,
    // user && user.roles.includes('member') && <li key="articles">
    //   <ActiveLink href="/articles" as="/articles">
    //     <a onClick={() => toggleNav(false)}>Articles</a>
    //   </ActiveLink>
    // </li>,
    user && user.roles.includes('member') && <li key="events">
      <ActiveLink href="/events" as="/events">
        <a onClick={() => toggleNav(false)}>Events</a>
      </ActiveLink>
    </li>,
    user && user.roles.includes('member') && <li key="tasks">
      <ActiveLink href="/tasks" as="/tasks">
        <a onClick={() => toggleNav(false)}>Tasks</a>
      </ActiveLink>
    </li>,
    user && <li key="book">
      <ActiveLink href="/book" as="/book">
        <a onClick={() => toggleNav(false)}>Book (early beta)</a>
      </ActiveLink>
    </li>,
    user && user.roles.includes('tdf') && <li key="applications">
      <ActiveLink href="/applications" as="/applications">
        <a onClick={() => toggleNav(false)}>Applications</a>
      </ActiveLink>
    </li>,
    user && user.roles.includes('tdf') && <li key="Nests">
      <ActiveLink href="/nests" as="/nests">
        <a onClick={() => toggleNav(false)}>Nests</a>
      </ActiveLink>
    </li>,
    user && <li key="settings">
      <ActiveLink href="/settings">
        <a onClick={() => toggleNav(false)}>Settings</a>
      </ActiveLink>
    </li>,
    user && <li key="profile">
      <ActiveLink as={`/members/${user.slug}`} href="/members/[slug]">
        <a onClick={() => toggleNav(false)}>Profile</a>
      </ActiveLink>
    </li>
  ])
};

export default MemberNav;
