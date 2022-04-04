import React from 'react';
import Newsletter from './Newsletter';
import { FaTelegramPlane } from '@react-icons/all-files/fa/FaTelegramPlane';
import { SiDiscord } from '@react-icons/all-files/si/SiDiscord';
import { SiTwitter } from '@react-icons/all-files/si/SiTwitter';
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram';
import { RiFacebookFill } from '@react-icons/all-files/ri/RiFacebookFill';
import Link from 'next/link';
import { __ } from '../utils/helpers';

import { theme } from '../tailwind.config';
import api from '../utils/api';
import { trackEvent } from './Analytics';
import { PLATFORM_NAME, LOGO_FOOTER, LOGO_HEADER, TEAM_EMAIL, INSTAGRAM_URL, FACEBOOK_URL, TELEGRAM_URL, TWITTER_URL, NEWSLETTER, DISCORD_URL } from '../config';

const footer = () => (
  <div className="border border-top">
    <footer className="main-content flex flex-col items-center p-4">
      <div className="flex flex-col md:flex-row py-2 items-center w-full justify-between">
        <div className='flex flex-col items-center md:items-start'>
          <div className="flex flex-row mb-8 md:mb-1">
            { INSTAGRAM_URL && <a
              href={ INSTAGRAM_URL }
              target="_blank"
              rel="noreferrer nofollow"
              title="Follow us on Instagram"
              className="text-2xl mr-2 rounded-full hover:text-gray-100 hover:bg-primary p-2 text-primary bg-transparent duration-300 hover:scale-110"
            >
              <SiInstagram />
            </a> }
            {FACEBOOK_URL && <a
              href={ FACEBOOK_URL }
              target="_blank"
              rel="noreferrer nofollow"
              title="Follow us on Facebook"
              className="text-2xl mr-2 rounded-full hover:text-gray-100 hover:bg-primary p-2 text-primary bg-transparent duration-300 hover:scale-110"
            >
              <RiFacebookFill />
            </a> }
            { TWITTER_URL && <a
              href={ TWITTER_URL }
              target="_blank"
              rel="noreferrer nofollow"
              title="Follow us on Twitter"
              className="text-2xl mr-2 rounded-full hover:text-gray-100 hover:bg-primary p-2 text-primary bg-transparent duration-300 hover:scale-110"
            >
              <SiTwitter />
            </a> }
            { DISCORD_URL && <a
              href={ DISCORD_URL }
              target="_blank"
              rel="noreferrer nofollow"
              title="Join Discord server"
              className="text-2xl mr-2 rounded-full hover:text-gray-100 hover:bg-primary p-2 text-primary bg-transparent duration-300 hover:scale-110"
            >
              <SiDiscord />
            </a> }
            {TELEGRAM_URL && <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer nofollow"
              title="Join Telegram Group"
              className="text-2xl mr-2 rounded-full hover:text-gray-100 hover:bg-primary p-2 text-primary bg-transparent duration-300 hover:scale-110"
            >
              <FaTelegramPlane />
            </a> }
          </div>
          <div className='flex flex-col items-start mt-8 text-gray-500'>
            <p className="text-xs">{ __('footer_phrase') } <a href="https://closer.earth" className="underline">{ __('footer_platform') }</a></p>
          </div>
        </div>

        <Newsletter placement="Footer" />

      </div>
    </footer>
  </div>
);

export default footer;
