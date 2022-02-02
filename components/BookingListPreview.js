import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ListingListPreview = ({ booking }) => {
  if (!booking) {
    return null;
  }

  return (
    <div className="booking-list-preview">
      { booking.get('description') &&
        <p>{ booking.get('description').slice(0, 120) }{ booking.get('description').length > 120 && '...' }</p>
      }
    </div>
  );
}

export default ListingListPreview;
