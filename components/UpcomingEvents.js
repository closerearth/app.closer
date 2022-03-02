import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useRouter } from 'next/router';
import { trackEvent } from './Analytics';
import api, { formatSearch, cdn } from '../utils/api';
import { usePlatform } from '../contexts/platform';
import { useAuth } from '../contexts/auth';
import Pagination from './Pagination';

const start = new Date();
dayjs.extend(advancedFormat);

const UpcomingEvents = ({
  center,
  card,
  list,
  title,
  channel,
  queryParam,
  page,
  limit,
  showPagination
}) => {

  const eventsFilter = { where: {
    start: {
      $gt: start
    },
    visibility: 'public'
  }, limit, page };

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [totalEvents, setTotalEvents] = useState(0);
  const [error, setErrors] = useState(false);
  const router = useRouter();
  const events = platform.event.find(eventsFilter);

  const loadData = async () => {
    try {
      const action = await platform.event.get(eventsFilter);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message)
    }
  };

  useEffect(() => {
    loadData();
  }, [page, channel, limit, start]);

  return (
    <div className={ card ? 'card': '' }>
      { title && <h3 className={card ? 'card-title' : ''}>
        { title }
      </h3> }
      <div className={`event-list ${card?'event-body':''} flex ${list?'flex-col':'flex-row'} flex-wrap justify-${center?'center':'start'}`}>
        { events && events.count() > 0?
          events.map((event) => {
            const start = event.get('start') && dayjs(event.get('start'));
            const end = event.get('end') && dayjs(event.get('end'));
            return (
              <div
                key={ event.get('_id') }

                className={`event-preview relative ${list?'mb-2':'pr-4 md:w-1/3 mb-8'}`}

              >
                <div
                  className={`${list?'flex flex-row':'card rounded bg-white overflow-hidden'}`}
                >
                  { event.get('photo') && <div className={`${list?'w-20':'-mx-4 -mt-4'}`}>
                    <Link href={`/events/${event.get('slug')}`}><a>
                      <img
                        className="w-full object-cover md:h-full"
                        src={ `${cdn}${event.get('photo')}-post-md.jpg`}
                        alt={ event.get('name') }
                      />
                    </a></Link>
                  </div> }
                  <div className={`p-2 ${list?'w-2/3':'text-center'}`}>
                    <div className="event-description">
                      <h4 className={`${list?'text-sm':'font-bold text-xl'}`}>
                        <Link href={`/events/${event.get('slug')}`}><a>{event.get('name')}</a></Link>
                      </h4>
                      { list?
                        ( start && <p className="text-gray-400 text-xs">
                          { start.format('MMM Do') }
                          { end && ` - ${end.format('MMM Do')}` }
                        </p> ):
                        (event.get('description') &&
                        <p className="text-sm mt-3">
                          { event.get('description').slice(0, 50) }
                          { event.get('description').length > 50 && '...' }
                        </p>)
                      }
                      {/* <p className="mt-5">
                        <Link href={`/events/${event.get('slug')}`}>
                          <a className="btn-primary"> Get ticket </a>
                        </Link>
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          }):
          <div className="w-full py-4">
            <p className="italic">No upcoming events.</p>
          </div>
        }
      </div>
      { showPagination && (page > 1 || (events && events.count() === limit)) &&
        <Pagination
          loadPage={ (page) => {
            loadData(page);
          }}
          page={ page }
          queryParam={ queryParam }
          limit={ limit }
          total={ totalEvents }
          items={ events }
        />
      }
    </div>
  )
};
UpcomingEvents.defaultProps = {
  showPagination: true,
  list: false,
  card: false,
  queryParam: 'events'
};

export default UpcomingEvents;
