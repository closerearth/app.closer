import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import EditModel from '../../components/EditModel';
import api from '../../utils/api';
import models from '../../models';
import { __ } from '../../utils/helpers';

const CreateListing = ({ token }) => {
  const router = useRouter();

  return (
    <Layout protect>
      <Head>
        <title>{ __('listings_create_title') }</title>
      </Head>
      <div className="main-content intro">
        <EditModel
          endpoint={ '/listing' }
          fields={ models.listing }
          buttonText="Create Listing"
          onSave={ listing => router.push(`/listings/${listing.slug}`) }
        />
      </div>
    </Layout>
  );
}

export default CreateListing;
