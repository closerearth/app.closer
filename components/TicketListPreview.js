import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { priceFormat } from '../utils/helpers';

const TicketListPreview = ({ ticket }) => {
  if (!ticket) {
    return null;
  }

  return (
    <div className="ticket-list-preview card">
      <div className="card-header">
        <Link href={`/tickets/${ticket.get('slug')}`}><a><b>{ ticket.get('name') }</b></a></Link>
      </div>
      <div className="card-body">
        <h4>Ticket number: {ticket._id}</h4>
        { ticket.get('price') &&
          <p>Price: <b>{ priceFormat(ticket.get('price')) }</b></p>
        }
      </div>
      <div className="card-footer">
        <Link href={`/tickets/${ticket.get('slug')}`}><a className="btn">Open ticket</a></Link>
      </div>
    </div>
  );
}

export default TicketListPreview;
