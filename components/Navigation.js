import React, { useState, useEffect } from 'react';
import { fromJS } from 'immutable'
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import slugify from 'slugify';
import { useRouter } from 'next/router';
import { trackEvent } from './Analytics';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/auth.js';
import ProfilePhoto from './ProfilePhoto';
import Prompts from './Prompts';
import FeaturedEvent from './FeaturedEvent';
import { useStatic } from '../contexts/static';
import { theme } from '../tailwind.config';
import api, { formatSearch } from '../utils/api';
import { LOGO_HEADER, LOGO_WIDTH, PLATFORM_NAME, TELEGRAM_URL, REGISTRATION_MODE } from '../config';

dayjs.extend(relativeTime);

/*
DEMOP


  <nav>
    <div className="flex justify-between items-center p-4 bg-white">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <div className="w-10">
          <img className="rounded-full" src="https://forbesthailand.com/wp-content/uploads/2021/08/https-specials-images.forbesimg.com-imageserve-5f47d4de7637290765bce495-0x0.jpgbackground000000cropX11699cropX23845cropY1559cropY22704.jpg" alt="" />
        </div>
      </div>
    </div>
  </nav>
*/

const start = new Date();

const Navigation = () => {
  const [navOpen, toggleNav] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState(null);
  const router = useRouter();
  const { cache, getStaticCache } = useStatic();

  useEffect(() => {
    (async () => {
      const where = formatSearch({ featured: true, end: { $gt: start } });
      const { data: { results: events } } = await api.get('/event', { params: { where, limit: 1 } });
      setFeaturedEvents(fromJS(events));
    })();
  }, []);

  const { user, loading, error, isAuthenticated, logout, setError } = useAuth();

  return (
    <div className="NavContainer pt-20 md:pt-0">
      { featuredEvents && featuredEvents.first() &&
        <FeaturedEvent event={ featuredEvents.first() } />
      }
      <nav className="h-20 fixed z-20 top-0 left-0 right-0 bg-background border-b border-b-line drop-shadow-sm md:relative md:drop-shadow-none">
        <div className="main-content flex flex-row-reverse md:flex-row justify-between items-center">
          <h3 className="logo">
            <Link href="/">
              <a className="block">
                { LOGO_HEADER ? <img
                  src={ LOGO_HEADER }
                  alt={ PLATFORM_NAME }
                  width={ LOGO_WIDTH }
                /> : PLATFORM_NAME }
              </a>
            </Link>
          </h3>

          <div className="menu-right no-print flex text-md flex-row justify-end items-center">
            <Link
              href="/events"
            >
              <a className="mr-3 hidden md:flex" onClick={() => toggleNav(false)}>
                Events
              </a>
            </Link>
            { isAuthenticated &&
              <Link
                href="/members"
              >
                <a className="mr-3 hidden md:flex" onClick={() => toggleNav(false)}>
                  Members
                </a>
              </Link>
            }
            { isAuthenticated && user.roles.includes('community-curator') &&
              <Link
                href="/applications"
              >
                <a className="mr-3 hidden md:flex" onClick={() => toggleNav(false)}>
                  Applications
                </a>
              </Link>
            }
            { isAuthenticated && user.roles.includes('admin') &&
              <Link
                href="/admin"
              >
                <a className="mr-3 hidden md:flex" onClick={() => toggleNav(false)}>
                  Admin
                </a>
              </Link>
            }
            { isAuthenticated ? (
              <Link href="/">
                <a
                  className="mr-3 hidden md:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleNav(false);
                    logout();
                    window.location.href = '/';
                  }}
                  title={user.screenname}
                >
                  Sign out
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a
                  className="mr-3 hidden md:flex"
                  onClick={() => toggleNav(false)}
                >
                  Sign in
                </a>
              </Link>
            )}
            { !isAuthenticated && ['paid', 'curated', 'open'].includes(REGISTRATION_MODE) && <Link href="/signup">
              <a
                className="btn-primary mr-3 hidden md:flex"
              >
                {
                  REGISTRATION_MODE === 'paid' ?
                    'Get your membership' :
                    REGISTRATION_MODE === 'curated' ?
                      'Apply':
                      'Signup'
                }
              </a>
            </Link> }
            {TELEGRAM_URL && !isAuthenticated && <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer nofollow"
              title="Join Telegram Group"
              className="text-4xl flex justify-center items-center mr-3"
            >
              <FontAwesomeIcon icon={faTelegram} color={ theme.extend.colors.primary } />
            </a> }
            { isAuthenticated &&
              <Link
                href="/members/[slug]"
                as={ `/members/${ user.slug }` }
              >

                <a title="View profile" className="hidden md:flex md:flex-row items-center" onClick={() => toggleNav(false)}>
                  <span className='h-8 border-l border-l-line mr-3' />
                  <ProfilePhoto user={ user } />
                  <p className='ml-3'>{user.screenname}</p>
                </a>
              </Link>
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
        <div className="subnav fixed top-20 left-0 right-0 bottom-0 z-10 bg-background no-print">
          <div className="main-content flex flex-col justify-start items-start space-y-2 text-lg text-center">
            <Link
              href="/events"
            >
              <a className="flex justify-center items-center" onClick={() => toggleNav(false)}>
                Events
              </a>
            </Link>
            { isAuthenticated &&
              <Link
                href="/members"
              >
                <a className="flex justify-center items-center" onClick={() => toggleNav(false)}>
                  Members
                </a>
              </Link>
            }
            { isAuthenticated && user.roles.includes('community-curator') &&
              <Link
                href="/applications"
              >
                <a className="flex justify-center items-center" onClick={() => toggleNav(false)}>
                  Applications
                </a>
              </Link>
            }
            { isAuthenticated && user.roles.includes('admin') &&
              <Link
                href="/admin"
              >
                <a className="flex justify-center items-center" onClick={() => toggleNav(false)}>
                  Admin
                </a>
              </Link>
            }
            { isAuthenticated ? (
              <Link href="/">
                <a
                  className="flex justify-center items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleNav(false);
                    logout();
                    window.location.href = '/';
                  }}
                  title={user.screenname}
                >
                  Sign out
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a
                  className="flex justify-center items-center"
                  onClick={() => toggleNav(false)}
                >
                  Sign in
                </a>
              </Link>
            )}
            { !isAuthenticated && ['paid', 'curated', 'open'].includes(REGISTRATION_MODE) && <Link href="/signup">
              <a
                className="btn-primary mr-3 hidden md:flex"
              >
                {
                  REGISTRATION_MODE === 'paid' ?
                    'Get your membership' :
                    REGISTRATION_MODE === 'curated' ?
                      'Apply':
                      'Signup'
                }
              </a>
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
            Close
          </a>
        </div>
      )}
      { isAuthenticated && <Prompts /> }
    </div>
  );
};

export default Navigation;
