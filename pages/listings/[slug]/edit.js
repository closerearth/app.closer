import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Layout from '../../../components/Layout';
import EditModel from '../../../components/EditModel';
import models from '../../../models';

import api from '../../../utils/api';
import { __ } from '../../../utils/helpers';

const EditListing = ({ listing }) => {
  const router = useRouter();
  const onUpdate = async (name, value, option, actionType) => {
    if (actionType === 'ADD' && name === 'visibleBy' && option._id) {
      await api.post(`/moderator/listing/${listing._id}/add`, option);
    }
  }
  if (!listing) {
    return <h1>{ __('listings_slug_edit_error') }</h1>;
  }

  return (
    <Layout protect>
      <Head>
        <title>{ __('listings_slug_edit_title') } {listing.name}</title>
      </Head>
      <div className="main-content">
        <EditModel
          id={ listing._id }
          endpoint={ '/listing' }
          fields={ models.listing }
          buttonText="Save"
          onSave={ listing => router.push(`/listings/${listing.slug}`) }
          onUpdate={ (name, value, option, actionType) => onUpdate(name, value, option, actionType) }
          allowDelete
          deleteButton="Delete Listing"
          onDelete={ () => router.push('/') }
        />
      </div>
    </Layout>
  );
}

EditListing.getInitialProps = async ({ query }) => {
  try {
    if (!query.slug) {
      throw new Error('No listing');
    }
    const { data: { results: listing } } = await api.get(`/listing/${query.slug}`);

    return { listing }
  } catch (err) {
    return {
      error: err.message
    };
  }
}

export default EditListing;
