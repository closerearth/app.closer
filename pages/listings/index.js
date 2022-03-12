import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/auth';
import { usePlatform } from '../../contexts/platform';
import ListingListPreview from '../../components/ListingListPreview';

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
        <title>Listings</title>
      </Head>
      { listings && listings.get('error') &&
        <div className="validation-error">{ listings.get('error') }</div>
      }
      <div className="main-content intro fullwidth">
        <div className="page-header flex justify-between">
          <h1>Listings</h1>
          <div className="user-actions">
            <Link as="/listings/create" href="/listings/create"><a className="btn-primary">Create</a></Link>
          </div>
        </div>
        <div className="listings-list">
          { listings && listings.count() > 0 ?
            listings.map(listing => <ListingListPreview key={ listing.get('_id') } listing={ listing } />):
            'No Listings'
          }
        </div>
      </div>
    </Layout>
  );
}

export default Listings;
