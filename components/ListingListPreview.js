import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { priceFormat } from '../utils/helpers';
import { __ } from '../utils/helpers';

const ListingListPreview = ({ listing }) => {
  if (!listing) {
    return null;
  }

  return (
    <div className="listing-list-preview card">
      <div className="card-header">
        <Link href={`/listings/${listing.get('slug')}`}><a><b>{ listing.get('name') }</b></a></Link>
      </div>
      <div className="card-body">
        { listing.get('description') &&
          <i>{ listing.get('description').slice(0, 120) }{ listing.get('description').length > 120 && '...' }</i>
        }
        { listing.get('dailyRate') &&
          <p><b>{ priceFormat(listing.getIn(['dailyRate', 'val']), listing.getIn(['dailyRate', 'cur'])) } { __('listing_preview_per_night') }</b>, { priceFormat(listing.getIn(['weeklyRate', 'val']), listing.getIn(['weeklyRate', 'cur'])) } { __('listing_preview_per_month') }</p>
        }
      </div>
      <div className="card-footer">
        <Link href={`/listings/${listing.get('slug')}/edit`}><a className="btn mr-2">{ __('listing_preview_edit') }</a></Link>
        <Link href={`/listings/book?listing=${listing.get('slug')}`}><a className="btn">{ __('listing_preview_book') }</a></Link>
      </div>
    </div>
  );
}

export default ListingListPreview;
