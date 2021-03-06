import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import ListingListPreview from '../../components/ListingListPreview';
import { __ } from '../../utils/helpers';

const Listings = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { platform } = usePlatform();

  const loadData = async () => {
    await Promise.all([
      platform.listing.get()
    ]);
  }

  useEffect(() => {
    if (user && user.roles.includes('admin')){
      loadData();
    }
  }, [user]);

  if (!user || !user.roles.includes('admin')) {
    return null;
  }

  const listings = platform.listing.find();

  return (
    <Layout>
      <Head>
        <title>{ __('listings_title') }</title>
      </Head>
      { listings && listings.get('error') &&
        <div className="validation-error">{ listings.get('error') }</div>
      }
      <div className="main-content intro fullwidth">
        <div className="flex flex-row">
          <div className="w-3/4 mr-4">
            <div className="page-header mb-3 flex justify-between">
              <h1>{ __('listings_title') }</h1>
              <div className="user-actions">
                <Link as="/listings/create" href="/listings/create"><a className="btn-primary">{ __('listings_create') }</a></Link>
              </div>
            </div>
            <div className="listings-list">
              { listings && listings.count() > 0 ?
                listings.map(listing => <ListingListPreview key={ listing.get('_id') } listing={ listing } />):
                'No Listings'
              }
            </div>
          </div>
          <div className="w-1/4">
            <h2>{ __('listings_book') }</h2>

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Listings;
