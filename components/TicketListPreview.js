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
      <div className="card-body">
        <p>Ticket ID: <b>{ ticket.get('_id') }</b></p>
        { ticket.get('name') &&
          <p>Ticket holder: <b>{ ticket.get('name') }</b></p>
        }
        { ticket.get('price') &&
          <p>Total cost: <b>{ priceFormat(ticket.get('price')) }</b></p>
        }
        { ticket.get('option') &&
          <p>Ticket type: <b>{ ticket.getIn(['option', 'name']) }</b></p>
        }
        { ticket.get('fields') &&
          ticket.get('fields').map((field, i) => (
            <p key={ field._id || field.id || i }>{ field.get('name') }: <b>{ field.get('value') }</b></p>
          ))
        }
      </div>
      <div className="card-footer">
        <Link href={`/tickets/${ticket.get('_id')}`}><a className="btn">View ticket</a></Link>
      </div>
    </div>
  );
}

export default TicketListPreview;
