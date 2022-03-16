import api, { formatSearch } from '../utils/api'
import Head from 'next/head'
import App from 'next/app'
import Router, { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation'
import { AuthProvider } from '../contexts/auth';
import { PlatformProvider } from '../contexts/platform'
import { DEFAULT_TITLE, SEMANTIC_URL, DEFAULT_DESCRIPTION, FB_DOMAIN_VERIFICATION } from '../config';
import { theme } from '../tailwind.config';
import '../public/styles.css';

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
        <meta name="description" content={ DEFAULT_DESCRIPTION } />
        <meta name="og:url" content={`${SEMANTIC_URL}${router.asPath}`} />
        <meta property="og:type" content="article" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
        <meta name="theme-color" content={ theme.extend.colors.primary } />
        <meta httpEquiv="content-language" content="en-us"/>
        { FB_DOMAIN_VERIFICATION && <meta name="facebook-domain-verification" content={ FB_DOMAIN_VERIFICATION } /> }
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <PlatformProvider>
          <Navigation query={ query } signedIn={ signedIn } />
          <div className="content-wrapper">
            <Component {...pageProps} query={ query } user={ user } signedIn={ signedIn } />
          </div>
        </PlatformProvider>
      </AuthProvider>
      <Footer tags={ tags } />
    </div>
  );
};

export default Application;
