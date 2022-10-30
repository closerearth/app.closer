import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { priceFormat } from '../utils/helpers';
import { __ } from '../utils/helpers';
import { cdn } from '../utils/api';
import { useAuth } from '../contexts/auth';

import Slider from './Slider';

const ListingListPreview = ({ listing, rate, book }) => {
  const { isAuthenticated, user } = useAuth();
  if (!listing || !isAuthenticated) {
    return null;
  }

  return (
    <div className="listing-list-preview card">
      <div className="card-header">
        <Link href={`/listings/${listing.get('slug')}`}><b>{ listing.get('name') }</b></Link>
      </div>
      <div className="card-body">
        { listing.get('photos') && listing.get('photos').count() > 0 && <Slider
          slides={listing.get('photos').toJS().map(id => ({
            image: `${cdn}${id}-post-md.jpg`
          }))}
        /> }
        { listing.get('description') &&
          <p className="my-3">
            { listing.get('description').slice(0, 120) }
            { listing.get('description').length > 120 && '...' }
          </p>
        }
        { listing.get('dailyRate') &&
          <p className="text-gray-500">
            { priceFormat(listing.getIn([rate, 'val']), listing.getIn([rate, 'cur'])) } { __('listing_preview_per_night') }
          </p>
        }
      </div>
      <div className="card-footer">
        { (user.roles.includes('admin') || user.roles.includes('space-host')) &&
          <Link
            href={`/listings/${listing.get('slug')}/edit`}
            className="btn mr-2"
           >{ __('listing_preview_edit') }</Link>
        }
        { book && <a className="btn" href="#" onClick={ (e) => { e.preventDefault();book();} }>
          { __('listing_preview_book') }</a>
        }
      </div>
    </div>
  );
}

ListingListPreview.defaultProps = {
  rate: 'dailyRate'
};

export default ListingListPreview;
