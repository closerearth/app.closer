import React, { useState, useEffect } from 'react';
import { fromJS } from 'immutable'
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import slugify from 'slugify';
import { useRouter } from 'next/router';
import { FaTelegram } from '@react-icons/all-files/fa/FaTelegram';

import { trackEvent } from './Analytics';
import { useAuth } from '../contexts/auth.js';
import ProfilePhoto from './ProfilePhoto';
import Prompts from './Prompts';
import FeaturedEvent from './FeaturedEvent';
import ConnectInjected from './ConnectInjected';
import { useStatic } from '../contexts/static';
import { theme } from '../tailwind.config';
import api, { formatSearch } from '../utils/api';
import { __ } from '../utils/helpers';
import { LOGO_HEADER, LOGO_WIDTH, PLATFORM_NAME, TELEGRAM_URL, REGISTRATION_MODE, FEATURES } from '../config';

dayjs.extend(relativeTime);

const platformLinks = [
  {
    label: 'Events',
    enabled: () => FEATURES.events,
    url: '/events'
  },
  {
    label: 'Members',
    url: '/members',
    roles: ['member']
  },
  {
    label: 'Applications',
    url: '/applications',
    enabled: () => REGISTRATION_MODE === 'curated',
    roles: ['community-curator', 'admin']
  },
  {
    label: 'Listings',
    url: '/listings',
    enabled: () => FEATURES.booking,
    roles: ['space-host', 'admin']
  },
  {
    label: 'Admin',
    url: '/admin',
    roles: ['admin']
  }
];
const start = new Date();

const Navigation = () => {
  const [navOpen, toggleNav] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState(null);
  const router = useRouter();
  const { cache, getStaticCache } = useStatic();
  const { user, loading, error, isAuthenticated, logout, setError } = useAuth();
  const links = platformLinks.filter(link => (!link.enabled || link.enabled()) && (
    !link.roles ||
    (
      isAuthenticated &&
      user.roles.some(role => link.roles.includes(role))
    )
  ));

  const loadData = async () => {
    const where = formatSearch({ featured: true, end: { $gt: start } });
    const { data: { results: events } } = await api.get('/event', { params: { where, limit: 1 } });
    setFeaturedEvents(fromJS(events));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="NavContainer pt-20 md:pt-0 relative">
      { featuredEvents && featuredEvents.first() &&
        <FeaturedEvent event={ featuredEvents.first() } />
      }
      <nav className="h-20 fixed z-50 top-0 left-0 right-0 shadow-sm md:relative">
        <div className="main-content flex flex-row-reverse md:flex-row justify-between items-center">
          <h3 className="logo">
            <Link href="/" className="block" legacyBehavior>

              { LOGO_HEADER ? <img
                src={ LOGO_HEADER }
                alt={ PLATFORM_NAME }
                width={ LOGO_WIDTH }
              /> : PLATFORM_NAME }

            </Link>
          </h3>

          <div className="menu-right no-print flex text-md flex-row justify-end items-center">
            {
              links.map(link => (
                (<Link
                key={ link.url }
                href={ link.url }
                className="mr-3 text-sm hidden md:flex"
                onClick={() => toggleNav(false)}
                legacyBehavior>

                  { link.label }

                </Link>)
              ))
            }
            { isAuthenticated ? (
              (<Link
              href="/"
              className="mr-3 text-sm hidden md:flex"
              onClick={(e) => {
                e.preventDefault();
                toggleNav(false);
                logout();
                window.location.href = '/';
              }}
              title={user.screenname}
              legacyBehavior>

                { __('navigation_sign_out') }

              </Link>)
            ) : (
              (<Link
              href="/login"
              className="mr-3 text-sm hidden md:flex"
              onClick={() => toggleNav(false)}
              legacyBehavior>

                { __('navigation_sign_in') }

              </Link>)
            )}
            { !isAuthenticated && ['paid', 'curated', 'open'].includes(REGISTRATION_MODE) && <Link
              href="/signup"
              className="btn-primary text-sm mr-3 hidden md:flex"
              legacyBehavior>

              {
                REGISTRATION_MODE === 'paid' ?
                  'Get your membership' :
                  REGISTRATION_MODE === 'curated' ?
                    'Apply':
                    'Signup'
              }

            </Link> }
            { isAuthenticated && FEATURES.booking && <Link href="/listings/book" className="btn mr-3 hidden md:flex" legacyBehavior>

              {
                user.roles.includes('member') ?
                  __('navigation_book') :
                  __('navigation_book_trial')
              }

            </Link> }
            {TELEGRAM_URL && !isAuthenticated && <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer nofollow"
              title="Join Telegram Group"
              className="text-2xl flex justify-center items-center mr-3 bg-primary text-white hover:scale-110 p-2 rounded-full duration-300"
            >
              <FaTelegram />
            </a> }
            { isAuthenticated &&
              <>
                <ConnectInjected />
                <span className='h-8 border-l mr-3' />
                <Link
                  href="/members/[slug]"
                  as={`/members/${user.slug}`}
                  title="View profile"
                  className="hidden md:flex md:flex-row items-center"
                  onClick={() => toggleNav(false)}
                >

                  <ProfilePhoto user={user} />
                </Link>
                <p className='ml-3'>{user.screenname}</p>
              </>
            }
            <a
              className="space-y-2 md:hidden"
              onClick={ (e) => {
                e.preventDefault();
                toggleNav(!navOpen);
              } }
            >
              <span className="block rounded-full ml-3 w-5 h-0.5 bg-primary"></span>
              <span className="block rounded-full w-8 h-0.5 bg-primary"></span>
              <span className="block rounded-full w-5 h-0.5 bg-primary"></span>
            </a>
          </div>
        </div>
      </nav>
      { navOpen &&
        <div className="subnav fixed top-20 left-0 right-0 bottom-0 z-10 bg-background no-print block md:hidden">
          <div className="flex flex-col justify-center items-start">
            { isAuthenticated &&
              <>
                <Link
                  href="/members/[slug]"
                  as={ `/members/${ user.slug }` }
                  title="View profile"
                  className="p-4 border-b block text-xl text-center w-full flex justify-start flex-row"
                  onClick={() => toggleNav(false)}
                  legacyBehavior>
                  <span>
                    <ProfilePhoto user={ user } />
                    <span className='ml-3'>{user.screenname}</span>
                  </span>
                </Link>
              </>
            }
            {
              links.map(link => (
                (<Link
                key={ link.url }
                href={ link.url }
                className="p-4 block text-xl w-full border-b"
                onClick={() => toggleNav(false)}
                legacyBehavior>

                  { link.label }

                </Link>)
              ))
            }
            { isAuthenticated && FEATURES.booking && <Link
              href="/listings/book"
              className="p-4 border-b block text-xl text-center w-full flex justify-start flex-row"
              legacyBehavior>

              {
                user.roles.includes('member') ?
                  __('navigation_book') :
                  __('navigation_book_trial')
              }

            </Link> }
            { isAuthenticated ? (
              (<Link
              href="/"
              className="p-4 block text-xl w-full"
              onClick={(e) => {
                e.preventDefault();
                toggleNav(false);
                logout();
                window.location.href = '/';
              }}
              title={user.screenname}
              legacyBehavior>

                { __('navigation_sign_out') }

              </Link>)
            ) : (
              (<Link
              href="/login"
              className="p-4 border-b block text-xl w-full"
              onClick={() => toggleNav(false)}
              legacyBehavior>

                { __('navigation_sign_in') }

              </Link>)
            )}
            { !isAuthenticated && ['paid', 'curated', 'open'].includes(REGISTRATION_MODE) && <Link href="/signup" className="p-4 block text-xl" legacyBehavior>

              {
                REGISTRATION_MODE === 'paid' ?
                  'Get your membership' :
                  REGISTRATION_MODE === 'curated' ?
                    'Apply':
                    'Signup'
              }

            </Link> }
          </div>
        </div>
      }
      {error && (
        <div className="error-toast">
          {error}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setError(null);
            }}
          >
            { __('navigation_close') }
          </a>
        </div>
      )}
      { isAuthenticated && <Prompts /> }
    </div>
  );
};

export default Navigation;
