import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { priceFormat } from '../utils/helpers';

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
          <p><b>{ priceFormat(listing.getIn(['dailyRate', 'val']), listing.getIn(['dailyRate', 'cur'])) } per night</b>, { priceFormat(listing.getIn(['weeklyRate', 'val']), listing.getIn(['weeklyRate', 'cur'])) } per month</p>
        }
      </div>
      <div className="card-footer">
        <Link href={`/listings/${listing.get('slug')}/edit`}><a className="btn">Edit</a></Link>
        <Link href={`/listings/${listing.get('slug')}/book`}><a className="btn">Book</a></Link>
      </div>
    </div>
  );
}

export default ListingListPreview;
