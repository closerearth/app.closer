import React from 'react'
import Newsletter from './Newsletter'
import Link from 'next/link'
import api from '../utils/api'
import { trackEvent } from './Analytics'
import { PLATFORM_NAME, LOGO_FOOTER, TEAM_EMAIL, INSTAGRAM_URL, FACEBOOK_URL, TWITTER_URL, NEWSLETTER, DISCORD_URL } from '../config';

const footer = () => (
  <div className="footer-wrapper no-print bg-primary">
    { NEWSLETTER && <Newsletter placement="Footer" /> }
    <footer className="main-content">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start">
          { LOGO_FOOTER && <img src={LOGO_FOOTER} width="110" alt={ PLATFORM_NAME } /> }
        </div>
        <div className="py-10 px-2">
          <div className="flex flex-row items-center justify-between mb-2">
            { INSTAGRAM_URL && <a href={ INSTAGRAM_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/instagram.svg" width="30" alt="instagram" />
            </a> }
            {FACEBOOK_URL && <a href={ FACEBOOK_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/facebook.svg" width="30" alt="facebook" />
            </a> }
            { TWITTER_URL && <a href={ TWITTER_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/twitter.svg" width="30" alt="twitter" />
            </a> }
            { DISCORD_URL && <a href={ DISCORD_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/discord.svg" width="30" alt="twitter" />
            </a> }
          </div>
          <div className="border-t border-background pt-2">
            <a href={`mailto:${TEAM_EMAIL}`} className="text-sm text-white hover:underline">{TEAM_EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default footer;
