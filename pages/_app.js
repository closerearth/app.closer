import api, { formatSearch } from '../utils/api'
import Head from 'next/head'
import App from 'next/app'
import Router, { useRouter } from 'next/router';
import Footer from '../components/Footer'
import Navigation from '../components/Navigation'
// import '../public/reset.css';
import '../public/styles.css';
// import '../public/css/card.css';
// import '../public/css/events.css';
// import '../public/css/posts.css';
// import '../public/css/calendar.css';
import '../public/fonts/Avenir.css';
import '../public/fonts/Metropolis.css';
import { AuthProvider } from '../contexts/auth'
import { PlatformProvider } from '../contexts/platform'
import { StaticProvider } from '../contexts/static'
import { DEFAULT_TITLE, SEMANTIC_URL, DEFAULT_DESCRIPTION } from '../config'

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically

const Application = ({ tags, query, signedIn, Component, pageProps, token, user }) => {
  const router = useRouter();

  if (query?.ref && typeof localStorage !== 'undefined') {
    localStorage.setItem('referrer', query.ref);
  }

  if (typeof token !== 'undefined') {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return (
    <div className="App">
      <Head>
        <title>{ DEFAULT_TITLE }</title>
        <meta charSet="utf-8" />
        <noscript>
          <link href="/reset.css" rel="stylesheet" />
          <link href="/fonts/Avenir.css" rel="stylesheet" />
          <link href="/fonts/Metropolis.css" rel="stylesheet" />
          <link href="/fonts/icons.css" rel="stylesheet" />
          <link href="/styles.css" rel="stylesheet" />
        </noscript>
        <meta name="description" content={ DEFAULT_DESCRIPTION } />
        <meta name="og:url" content={`${SEMANTIC_URL}${router.asPath}`} />
        <meta property="og:type" content="article" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
        <meta name="theme-color" content="#119977" />
        <meta httpEquiv="content-language" content="en-us"/>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <PlatformProvider>
          <StaticProvider>
            <Navigation query={ query } signedIn={ signedIn } />
            <div className="content-wrapper">
              <Component {...pageProps} query={ query } user={ user } signedIn={ signedIn } />
            </div>
          </StaticProvider>
        </PlatformProvider>
      </AuthProvider>
      <Footer tags={ tags } />
    </div>
  );
};

export default Application;
