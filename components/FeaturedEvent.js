import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { cdn } from '../utils/api';

const FeaturedEvent = ({ event }) => {
  const start = event.get('start') && dayjs(event.get('start'));
  const end = event.get('end') && dayjs(event.get('end'));

  return (
    <div key={ event.get('_id') } className="shadow-sm">
      <div className="main-content flex flex-row p-2 justify-between">
        <div className="preview flex flex-row">
          { event.get('photo') && <div className="mr-4">
            <Link href={`/events/${event.get('slug')}`}><a>
              <img
                className="h-16 object-cover"
                src={ `${cdn}${event.get('photo')}-post-md.jpg`}
                alt={ event.get('name') }
              />
            </a></Link>
          </div> }
          <div className="event-description flex flex-col items-start justify-center">
            <h4 className="font-bold">
              <Link href={`/events/${event.get('slug')}`}><a>{event.get('name')}</a></Link>
            </h4>
            { start && <p className="text-gray-400 text-xs">
              { start.format('MMM Do') }
              { end && ` - ${end.format('MMM Do')}` }
            </p> }
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Link href={`/events/${event.get('slug')}`}><a className="btn-primary text-sm">Get your ticket</a></Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedEvent;
