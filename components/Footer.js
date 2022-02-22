import React from 'react'
import Newsletter from './Newsletter'
import Link from 'next/link'
import api from '../utils/api'
import { trackEvent } from './Analytics'
import { PLATFORM_NAME, LOGO_FOOTER, TEAM_EMAIL, INSTAGRAM_URL, FACEBOOK_URL, TWITTER_URL, NEWSLETTER, DISCORD_URL } from '../config';

const footer = () => (
  <div className="bg-slate-50  border-t border-t-neutral-700">
    <footer className="flex flex-col items-center p-4">
        {/* <div className="flex flex-row items-center justify-start">
          { LOGO_FOOTER && <img src={LOGO_FOOTER} width="110" alt={ PLATFORM_NAME } /> }
        </div> */}
        <div className="flex flex-col md:flex-row py-2 items-center w-11/12 justify-between">
          <div className='flex flex-col items-center'>
          <div className="flex flex-row space-x-7 self-center p-4 mb-8 md:mb-1">
            { INSTAGRAM_URL && <a href={ INSTAGRAM_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/instagram.svg" width="40" alt="instagram" className="bg-primary rounded-3xl p-1"/>
            </a> }
            {FACEBOOK_URL && <a href={ FACEBOOK_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/facebook.svg" width="40" alt="facebook" className="bg-primary rounded-3xl p-1" />
            </a> }
            { TWITTER_URL && <a href={ TWITTER_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/twitter.svg" width="40" alt="twitter" className="bg-primary rounded-3xl p-1" />
            </a> }
            { DISCORD_URL && <a href={ DISCORD_URL } target="_blank" rel="noreferrer nofollow">
              <img src="/images/icons/discord.svg" width="40" alt="twitter" className="bg-primary rounded-3xl p-1"/>
            </a> }
          </div>
          <p className='m-2 p-2 hidden md:flex'>Powered by: closer</p>
          </div>
          
          {/* <div className="border-t border-background pt-2">
            <a href={`mailto:${TEAM_EMAIL}`} className="text-sm text-white hover:underline">{TEAM_EMAIL}</a>
          </div>
           */}
          {/* <div className='flex flex-col items-start text-sm'>
            <p className='mb-2'>Keep in the loop, subscribe:</p>
          <form>
            <input type="text" placeholder='Your email' />
            <div className='flex flex-row justify-between w-80'>
              <div className='flex flex-row mt-2'>
              <input type="checkbox"/>
              <label className='ml-4'> I agree to the T&C. Read.</label>
              </div>
              <button type="submit" className='self-center'>Sign up</button>
            </div>
          </form>
          </div>
          <p className='m-4 p-2 self-center md:hidden'>Powered by: closer</p> */}

<Newsletter placement="Footer" />

      </div>
    </footer>
  </div>
);

export default footer;
