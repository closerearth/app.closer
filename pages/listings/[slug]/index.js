import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api, { formatSearch, cdn } from '../../../utils/api';
import UploadPhoto from '../../../components/UploadPhoto';
import PostList from '../../../components/PostList';
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';
import { __ } from '../../../utils/helpers';

const Listing = ({ listing, error }) => {
  const [photo, setPhoto] = useState(listing.photos && listing.photos[0]);
  const { isAuthenticated, user } = useAuth();

  if (!listing) {
    return <PageNotFound />;
  }

  return (
    <Layout>
      <Head>
        <title>{ listing.name }</title>
        <meta name="description" content={listing.description} />
        <meta property="og:type" content="listing" />
        { photo && <meta key="og:image" property="og:image" content={ `${cdn}${photo}-place-lg.jpg` } /> }
        { photo && <meta key="twitter:image" name="twitter:image" content={ `${cdn}${photo}-place-lg.jpg` } /> }
      </Head>
      <main className="main-content">
        <div>
          <div className="relative bg-gray-200 md:h-80 mb-4">
            <div className="justify-self-center absolute top-0 left-0 right-0 flex justify-center items-center h-full">
              { photo && <img
                className="object-cover md:h-full md:w-full"
                src={ `${cdn}${photo}-max-lg.jpg` }
                alt={ event.name }
              /> }
              { (isAuthenticated && user._id === listing.createdBy) &&
                <UploadPhoto
                  model="listing"
                  id={listing._id}
                  onSave={id => setPhoto(id)}
                  label={ photo ? 'Change photo': 'Add photo' }
                />
              }
            </div>
          </div>
          <div>
            <h1>{listing.name}</h1>
            { error && <div className="validation-error">{error}</div> }
            <section>
              <p>
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a
                      target="_blank"
                      rel="nofollow noreferrer"
                      href={decoratedHref}
                      key={key}
                      onClick={e => e.stopPropagation()}
                    >
                      {decoratedText}
                    </a>
                  )}
                >
                  {listing.description}
                </Linkify>
              </p>
            </section>
            <section className="my-4">
              <Link href={`/listings/book?listing=${listing.slug}`}>
                <a className="text-lg btn-primary">{ __('listings_slug_link') }</a>
              </Link>
            </section>
            <section>
              <PostList
                visibility="public"
                parentId={ listing._id }
                parentType="listing"
                channel={ listing.category }
              />
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
Listing.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: listing } } = await api.get(`/listing/${query.slug}`);
    return { listing };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Listing;
