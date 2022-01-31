import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ListingListPreview = ({ listing }) => {
  if (!listing) {
    return null;
  }

  return (
    <div className="listing-list-preview columns vertical-center spaced-table">
      <div className="col"><b>{ listing.get('name') }</b></div>
      <div className="col">
        { listing.get('description') &&
          <i>{ listing.get('description').slice(0, 120) }{ listing.get('description').length > 120 && '...' }</i>
        }
      </div>
      <div className="col">
        <b>{ listing.get('price') }€/night</b>
      </div>
    </div>
  );
}

export default ListingListPreview;
