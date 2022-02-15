import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { trackEvent } from './Analytics';
import api, { formatSearch, cdn } from '../utils/api';
import { usePlatform } from '../contexts/platform';
import { useAuth } from '../contexts/auth.js';
import Pagination from './Pagination';

const start = new Date();

const UpcomingEvents = ({ center, channel, queryParam, page, limit, label, labelLink, attendees, allowCreate, showPagination }) => {

  const eventsFilter = { where: {
    start: {
      $gt: start
    }
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
    <section>
      <div className={`card-body event-list flex flex-row flex-wrap justify-${center?'center':'start'}`}>
        { events && events.count() > 0?
          events.map(event => (
            <div key={ event.get('_id') } className="event-preview relative live md:w-10/12 flex flex-row pr-4 mb-8">
              <div className="card rounded bg-white overflow-hidden">
                { event.get('photo') && <div className="-mx-4 -mt-4">
                  <Link href={`/events/${event.get('slug')}`}><a>
                    <img
                      className="w-full object-cover md:h-full"
                      src={ `${cdn}${event.get('photo')}-post-md.jpg`}
                      alt={ event.get('name') }
                    />
                  </a></Link>
                </div> }
                <div className="p-2 text-center">
                  <div className="event-description">
                    <h3 className="font-bold text-xl">
                      <Link href={`/events/${event.get('slug')}`}><a>{event.get('name')}</a></Link>
                    </h3>
                    { event.get('description') &&
                      <p className="text-sm mt-3">
                        { event.get('description').slice(0, 50) }
                        { event.get('description').length > 50 && '...' }
                      </p>
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
          )):
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
    </section>
  )
};
UpcomingEvents.defaultProps = {
  allowCreate: false,
  label: 'Upcoming Events',
  labelLink: '/events',
  showPagination: true
};

export default UpcomingEvents;
