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
