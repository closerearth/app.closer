import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { cdn } from '../utils/api';

dayjs.extend(advancedFormat);

const EventPreview = ({ event, list }) => {
  const start = event.get('start') && dayjs(event.get('start'));
  const end = event.get('end') && dayjs(event.get('end'));
  const duration = end && end.diff(start, 'hour', true);
  const isThisYear = dayjs().isSame(start, 'year');
  const dateFormat = isThisYear ? 'MMMM Do HH:mm' : 'YYYY MMMM Do HH:mm';

  return (
    <div
      key={ event.get('_id') }

      className={`event-preview relative ${list?'mb-2':'pr-4 md:w-1/3 mb-8'}`}

    >
      <div
        className={`${list?'flex flex-row':'card rounded bg-white overflow-hidden'}`}
      >
        { event.get('photo')?
          <div className={`${list?'w-20':'-mx-4 -mt-4'}`}>
            <Link href={`/events/${event.get('slug')}`}><a>
              <img
                className="w-full object-cover md:h-full"
                src={ `${cdn}${event.get('photo')}-post-md.jpg`}
                alt={ event.get('name') }
              />
            </a></Link>
          </div>:
          event.get('visual') &&
          <div className={`${list?'w-20':'-mx-4 -mt-4'}`}>
            <Link href={`/events/${event.get('slug')}`}><a>
              <img
                className="w-full object-cover md:h-full"
                src={ event.get('visual') }
                alt={ event.get('name') }
              />
            </a></Link>
          </div>
        }
        <div className={`p-2 ${list?'w-2/3':'text-center'}`}>
          <div className="event-description">
            <h4 className={`${list?'text-sm':'font-bold text-xl'}`}>
              <Link href={`/events/${event.get('slug')}`}><a>{event.get('name')}</a></Link>
            </h4>
            <p className="text-xs font-light">
              { start && start.format(dateFormat) }
              { end && duration <= 24 && ` - ${ end.format('HH:mm') }` }
            </p>
            {event.get('location') &&
              <p className="text-sm">
                { event.get('location') }
              </p>
            }
            {event.get('description') &&
              <p className="text-sm mt-3">
                { event.get('description').slice(0, 50) }
                { event.get('description').length > 50 && '...' }
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
EventPreview.defaultProps = {
}

export default EventPreview;
