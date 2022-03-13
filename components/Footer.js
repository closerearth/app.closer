import React from 'react';
import Newsletter from './Newsletter';
import { faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import api from '../utils/api';
import { trackEvent } from './Analytics';
import { theme } from '../tailwind.config';
import { PLATFORM_NAME, LOGO_FOOTER, LOGO_HEADER, TEAM_EMAIL, INSTAGRAM_URL, FACEBOOK_URL, TELEGRAM_URL, TWITTER_URL, NEWSLETTER, DISCORD_URL } from '../config';

const footer = () => (
  <div className="border border-top">
    <footer className="main-content flex flex-col items-center p-4">
      <div className="flex flex-col md:flex-row py-2 items-center w-full justify-between">
        <div className='flex flex-col items-center md:items-start'>
          <div className="flex flex-row mb-8 md:mb-1">
            { INSTAGRAM_URL && <a href={ INSTAGRAM_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/instagram.svg" width="36" alt="instagram" className="bg-primary rounded-3xl p-1 mr-2"/>
            </a> }
            {FACEBOOK_URL && <a href={ FACEBOOK_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/facebook.svg" width="36" alt="facebook" className="bg-primary rounded-3xl p-1 mr-2" />
            </a> }
            { TWITTER_URL && <a href={ TWITTER_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/twitter.svg" width="36" alt="twitter" className="bg-primary rounded-3xl p-1 mr-2" />
            </a> }
            { DISCORD_URL && <a href={ DISCORD_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/discord.svg" width="36" alt="twitter" className="bg-primary rounded-3xl p-1 mr-2"/>
            </a> }
            {TELEGRAM_URL && <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer nofollow"
              title="Join Telegram Group"
              className="text-4xl flex justify-center items-center mr-3 background-primary"
            >
              <FontAwesomeIcon icon={faTelegram} color={ theme.extend.colors.primary } />
            </a> }
          </div>
          <div className='flex flex-col items-start mt-8'>
            <p className="text-xs">Made with ❤️ by <a href="https://closer.earth">Closer</a></p>
          </div>
        </div>

        <Newsletter placement="Footer" />

      </div>
    </footer>
  </div>
);

export default footer;
