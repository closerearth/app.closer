import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { prependHttp } from '../utils/helpers';


const EventActions = ({ event, user, start, dateFormat, end, duration, loadError, myTickets, isAuthenticated, attendees, attendEvent, featured, featureEvent }) => {
  return (<div className="md:w-1/2 p-2">
    <h2 className="text-xl font-light">
      {start && start.format(dateFormat)}
      {end && duration > 24 && ` - ${end.format(dateFormat)}`}
      {end && duration <= 24 && ` - ${end.format('HH:mm')}`}
    </h2>
    {event.address && <h3 className="text-lg font-light text-gray-500">{event.address}</h3>}
    {end && end.isBefore(dayjs()) && <h3 className="p3 mr-2 italic">
      Event ended
    </h3>}
    <h1 className="md:text-4xl mt-4 font-bold">{event.name}</h1>
    {loadError && <div className="validation-error">{loadError}</div>}

    <div className="mt-4 event-actions flex items-center">
      {event.paid ? <>
        {myTickets && myTickets.count() > 0 ? <Link as={`/tickets/${myTickets.first().get('_id')}`} href="/tickets/[slug]">
          <a className="btn-primary mr-2">See ticket</a>
        </Link> : event.ticket && start && start.isAfter(dayjs()) ? <Link href={prependHttp(event.ticket)}>
          <a className="btn-primary mr-2" target="_blank" rel="noreferrer nofollow">Buy ticket</a>
        </Link> : start && start.isAfter(dayjs()) ? <Link as={`/events/${event.slug}/checkout`} href="/events/[slug]/checkout">
          <a className="btn-primary mr-2">Buy ticket</a>
        </Link> : null}
      </> : <>
        {start && start.isBefore(dayjs().subtract(15, 'minutes')) && end && end.isAfter(dayjs()) && event.location ? <a className="btn-primary mr-2" href={event.location}>Hop on!</a> : start.isBefore(dayjs()) && end && end.isAfter(dayjs()) ? <span className="p3 mr-2" href={event.location}>ONGOING</span> : !isAuthenticated && event.recording ? <Link as={`/signup?back=${encodeURIComponent(`/events/${event.slug}`)}`} href="/signup">
          <a className="btn-primary mr-2">Signup to watch recording</a>
        </Link> : !isAuthenticated && start && start.isAfter(dayjs()) ? <Link as={`/signup?back=${encodeURIComponent(`/events/${event.slug}`)}`} href="/signup">
          <a className="btn-primary mr-2">Signup to RSVP</a>
        </Link> : end && end.isBefore(dayjs()) ? start && start.isAfter(dayjs()) && end && end.isBefore(dayjs()) && event.location && <a className="btn-primary mr-2" href={event.location}>Hop on!</a> : attendees?.includes(user._id) ? <a href="#" className="btn-primary mr-2" onClick={e => {
          e.preventDefault();
          attendEvent(event._id, !attendees?.includes(user._id));
        }}>
                                      Cancel RSVP
        </a> : <button onClick={e => {
          e.preventDefault();
          attendEvent(event._id, !attendees?.includes(user._id));
        }} className="btn-primary mr-2">
                                      Attend
        </button>}
      </>}
      {isAuthenticated && user.roles.includes('admin') && <a className={`btn-primary inline-flex items-center ${featured ? 'active' : ''}`} href="#" title="Feature event" onClick={e => featureEvent(e, event._id, !featured)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </a>}
      {
      /* <AddToCalendar event={{
       title: `${config.PLATFORM_NAME}: ${event.name}`,
       description: event.description,
       // location: 'Fábrica de Sonhos Tradicional, 7540-011, Abela, Santiago do Cacém, Portugal',
       startTime: event.start,
       endTime: event.end,
      }} buttonLabel="Add to calendar" /> */
      }
    </div>
    {isAuthenticated && (user._id === event.createdBy || user.roles.includes('admin') || user.roles.includes('space-host')) && <div className="admin-actions mt-3 border-t pt-3">
      {user._id === event.createdBy || user.roles.includes('admin') && <Link as={`/events/${event.slug}/edit`} href="/events/[slug]/edit">
        <a className="btn-secondary text-xs mr-2">Edit event</a>
      </Link>}
      {event.paid && (user._id === event.createdBy || user.roles.includes('admin') || user.roles.includes('space-host')) && <Link as={`/events/${event.slug}/tickets`} href="/events/[slug]/tickets">
        <a className="btn-secondary text-xs mr-2">View tickets</a>
      </Link>}
    </div>}
  </div>);
}

export default EventActions;
  
  