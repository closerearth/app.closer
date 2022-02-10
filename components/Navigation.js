import React, { useState, useEffect } from 'react';
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
import { useStatic } from '../contexts/static';
import { theme } from '../tailwind.config';
import { LOGO_HEADER, PLATFORM_NAME, TELEGRAM_URL } from '../config';

dayjs.extend(relativeTime);

/*
DEMOP


  <nav>
    <div class="flex justify-between items-center p-4 bg-white">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <div class="w-10">
          <img class="rounded-full" src="https://forbesthailand.com/wp-content/uploads/2021/08/https-specials-images.forbesimg.com-imageserve-5f47d4de7637290765bce495-0x0.jpgbackground000000cropX11699cropX23845cropY1559cropY22704.jpg" alt="" />
        </div>
      </div>
    </div>
  </nav>
*/

const Navigation = () => {
  const [navOpen, toggleNav] = useState(false);
  const [now, setNow] = useState(dayjs());
  const router = useRouter();
  const { cache } = useStatic();

  useEffect(() => {
    const tick = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const { user, loading, error, isAuthenticated, logout, setError } = useAuth();

  return (
    <div className="NavContainer">
      <nav className={`${navOpen ? 'open' : 'closed'}`}>
        <div className="main-content flex flex-row justify-between items-center">
          <h3 className="logo">
            <Link href="/">
              <a className="block">
                { LOGO_HEADER ? <img
                  src={LOGO_HEADER}
                  alt={PLATFORM_NAME}
                /> : PLATFORM_NAME }
              </a>
            </Link>
          </h3>

          <div className="menu-right no-print flex text-sm flex-row justify-end items-center">
            <Link
              href="/events"
            >
              <a className="mr-2 hidden md:flex" onClick={() => toggleNav(false)}>
                Events
              </a>
            </Link>
            { isAuthenticated &&
              <Link
                href="/members"
              >
                <a className="mr-2 hidden md:flex" onClick={() => toggleNav(false)}>
                  Members
                </a>
              </Link>
            }
            { isAuthenticated && user.roles.includes('community-curator') &&
              <Link
                href="/applications"
              >
                <a className="mr-2 hidden md:flex" onClick={() => toggleNav(false)}>
                  Applications
                </a>
              </Link>
            }
            { isAuthenticated && user.roles.includes('admin') &&
              <Link
                href="/admin"
              >
                <a className="mr-2 hidden md:flex" onClick={() => toggleNav(false)}>
                  Admin
                </a>
              </Link>
            }
            { isAuthenticated ? (
              <Link href="/">
                <a
                  className="mr-2 hidden md:flex"
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
                  className="mr-2 hidden md:flex"
                  onClick={() => toggleNav(false)}
                >
                  Sign in
                </a>
              </Link>
            )}
            { !isAuthenticated && <Link href="/signup">
              <a
                href="/signup"
                className="btn-primary mr-2 hidden md:flex"
              >
                Get your membership
              </a>
            </Link> }
            {TELEGRAM_URL && !isAuthenticated && <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer nofollow"
              title="Join Telegram Group"
              className="text-4xl flex justify-center items-center mr-2"
            >
              <FontAwesomeIcon icon={faTelegram} color={ theme.extend.colors.primary } />
            </a> }
            { isAuthenticated &&
              <Link
                href="/members/[slug]"
                as={ `/members/${ user.slug }` }
              >
                <a title="View profile" className="mr-2" onClick={() => toggleNav(false)}>
                  <ProfilePhoto user={ user } />
                </a>
              </Link>
            }
            {/* <a
              class="space-y-2"
              onClick={ (e) => {
                e.preventDefault();
                toggleNav(true);
              } }
            >
              <span class="block rounded-full ml-3 w-5 h-0.5 bg-primary"></span>
              <span class="block rounded-full w-8 h-0.5 bg-primary"></span>
              <span class="block rounded-full w-5 h-0.5 bg-primary"></span>
            </a> */}
          </div>
        </div>
      </nav>
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
