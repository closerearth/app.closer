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
import EventPreview from './EventPreview';

const now = new Date();
dayjs.extend(advancedFormat);

const EventsList = ({
  center,
  card,
  list,
  title,
  channel,
  queryParam,
  where,
  limit,
  showPagination
}) => {
  const { user } = useAuth();
  const { platform } = usePlatform();
  const [error, setErrors] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const eventsFilter = { where, limit, page };
  const events = platform.event.find(eventsFilter);
  const totalEvents = platform.event.findCount(eventsFilter);

  const loadData = async () => {
    try {
      await Promise.all([
        platform.event.get(eventsFilter),
        platform.event.getCount(eventsFilter)
      ]);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message)
    }
  };

  useEffect(() => {
    loadData();
  }, [eventsFilter]);

  return (
    <div className={ card ? 'card': '' }>
      { title && <h3 className={card ? 'card-title' : ''}>
        { title }
      </h3> }
      <div className={`event-list ${card?'event-body':''} flex ${list?'flex-col':'flex-row'} flex-wrap justify-${center?'center':'start'}`}>
        { events && events.count() > 0?
          events.map((event) => <EventPreview key={ event.get('_id') } list={ list } event={ event } />):
          <div className="w-full py-4">
            <p className="italic">No upcoming events.</p>
          </div>
        }
      </div>
      { showPagination &&
        <Pagination
          loadPage={ (page) => {
            setPage(page);
            loadData();
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
EventsList.defaultProps = {
  where: undefined,
  showPagination: true,
  list: false,
  card: false,
  queryParam: 'events'
};

export default EventsList;
