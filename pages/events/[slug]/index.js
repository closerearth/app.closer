import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import api, { formatSearch, cdn } from '../../../utils/api';
import { prependHttp } from '../../../utils/helpers';
import config from '../../../config';
import UpcomingEvents from '../../../components/UpcomingEvents';
import UploadPhoto from '../../../components/UploadPhoto';
import CreatePost from '../../../components/CreatePost';
import PostList from '../../../components/PostList';
import ProfilePhoto from '../../../components/ProfilePhoto';
import Photo from '../../../components/Photo';
import TimeSince from '../../../components/TimeSince';
import EventAttendees from '../../../components/EventAttendees';
import EventPhoto from '../../../components/EventPhoto';
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';
import { serializeHtml } from '@udecode/plate'

dayjs.extend(advancedFormat)

const Event = ({ event, error }) => {

  const [photo, setPhoto] = useState(event && event.photo);
  const [partnerToAdd, setPartnerToAdd] = useState({
    name: '',
    photo: null
  });
  const [loadError, setErrors] = useState(null);
  const [password, setPassword] = useState('');
  const [featured, setFeatured] = useState(event && !!event.featured);
  const { platform } = usePlatform();
  const { user, isAuthenticated } = useAuth();
  const [attendees, setAttendees] = useState(event && (event.attendees || []));
  const [ticketsSold, setTicketsSold] = useState([]);
  const ticketsFilter = event && { where: { event: event._id, status: 'approved' } };
  const myTicketFilter = event && { where: { event: event._id, status: 'approved', email: user && user.email } };
  const start = event && event.start && dayjs(event.start);
  const end = event && event.end && dayjs(event.end);
  const duration = end && end.diff(start, 'hour', true);
  const timeUntil = start && start.diff(dayjs(), 'hour', true);
  const isThisYear = dayjs().isSame(start, 'year');
  const dateFormat = isThisYear ? 'MMMM Do HH:mm' : 'YYYY MMMM Do HH:mm';
  const myTickets = platform.ticket.find(myTicketFilter);

  const loadData = async () => {
    if (event.attendees && event.attendees.length > 0) {
      const params = { where: { _id: { $in: event.attendees } } };
      await Promise.all([
        // Load attendees list
        platform.user.get(params),
        platform.ticket.get(myTicketFilter)
      ]);
    }
  }

  const attendEvent = async (_id, attend) => {
    try {
      const { data: { results: event } } = await api.post(`/attend/event/${_id}`, { attend });
      setAttendees(attend ? event.attendees.concat(user._id) : event.attendees.filter(a => a !== user._id));
    } catch (err) {
      alert(`Could not RSVP: ${err.message}`)
    }
  }

  const addPartner = async (e, partner) => {
    e.preventDefault();
    try {
      await platform.event.patch(event._id, {
        partners: (event.partners || []).concat(partner)
      });
    } catch (err) {
      alert(`Could not add partner: ${err.message}`)
    }
  }

  const featureEvent = async (e, _id, featured) => {
    e.preventDefault();
    try {
      await platform.event.patch(_id, { featured });
      setFeatured(featured);
    } catch (err) {
      alert(`Could feature event: ${err.message}`)
    }
  }

  useEffect(() => {
    if (event) {
      loadData();
    }
  }, [event, ticketsSold, user]);

  if (!event) {
    return <PageNotFound error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>{ event.name }</title>
        <meta name="description" content={event.description} />
        <meta property="og:type" content="event" />
        { photo && <meta key="og:image" property="og:image" content={ `${cdn}${photo}-place-lg.jpg` } /> }
        { photo && <meta key="twitter:image" name="twitter:image" content={ `${cdn}${photo}-place-lg.jpg` } /> }
      </Head>
      { event.password && event.password !== password ?
        <div className="flex flex-col justify-center items-center">
          <div className="w-34">
            <h1>This event is password protected</h1>
            <input onChange={ e => setPassword(e.target.value) } placeholder="password" type="password" />
            {isAuthenticated && (user._id === event.createdBy || user.roles.includes('admin')) &&
              <div className="admin-actions mt-3 border-t pt-3">
                <Link as={`/events/${event.slug}/edit`} href="/events/[slug]/edit">
                  <a className="btn-secondary text-xs mr-2">Edit event</a>
                </Link>
              </div>
            }
          </div>
        </div>:
        <div>
          <section className="py-5">
            <div className="main-content md:flex flex-row justify-center items-center">
              <EventPhoto
                event={event}
                user={user}
                photo={photo}
                cdn={cdn}
                isAuthenticated={isAuthenticated}
                setPhoto={setPhoto}
              />
              <div className="md:w-1/2 p-2">
                <h2 className="text-xl font-light">
                  { start && start.format(dateFormat) }
                  { end && duration > 24 && ` - ${ end.format(dateFormat) }` }
                  { end && duration <= 24 && ` - ${ end.format('HH:mm') }` }
                </h2>
                { event.address && <h3 className="text-lg font-light text-gray-500">{event.address}</h3> }
                {
                  end && end.isBefore(dayjs()) &&
                    <h3 className="p3 mr-2 italic">
                      Event ended
                    </h3>
                }
                <h1 className="md:text-4xl mt-4 font-bold">{event.name}</h1>
                { loadError && <div className="validation-error">{loadError}</div> }

                <div className="mt-4 event-actions flex items-center">
                  { event.ticket && start && start.isAfter(dayjs())?
                    <Link href={ prependHttp(event.ticket) }>
                      <a className="btn-primary mr-2" target="_blank" rel="noreferrer nofollow">Buy ticket</a>
                    </Link>:
                    event.paid ?
                      <>
                        { myTickets && myTickets.count() > 0 ?
                          <Link as={`/tickets/${myTickets.first().get('_id')}`} href="/tickets/[slug]">
                            <a className="btn-primary mr-2">See ticket</a>
                          </Link>:
                          start && start.isAfter(dayjs()) &&
                          <Link as={`/events/${event.slug}/checkout`} href="/events/[slug]/checkout">
                            <a className="btn-primary mr-2">Buy ticket</a>
                          </Link>
                        }
                      </>:
                      <>
                        {
                          start && start.isBefore(dayjs().subtract(15, 'minutes')) && end && end.isAfter(dayjs()) && event.location?
                            <a className="btn-primary mr-2" href={ event.location }>Join call</a>:
                            start && start.isBefore(dayjs()) && end && end.isAfter(dayjs()) ?
                              <span className="p3 mr-2" href={ event.location }>ONGOING</span>:
                              !isAuthenticated && event.recording ?
                                <Link as={`/signup?back=${encodeURIComponent(`/events/${event.slug}`)}`} href="/signup">
                                  <a className="btn-primary mr-2">Signup to watch recording</a>
                                </Link>:
                                !isAuthenticated && start && start.isAfter(dayjs()) ?
                                  <Link as={`/signup?back=${encodeURIComponent(`/events/${event.slug}`)}`} href="/signup">
                                    <a className="btn-primary mr-2">Signup to RSVP</a>
                                  </Link>:
                                  end && end.isBefore(dayjs()) && user && attendees?.includes(user._id) ?
                                    <a
                                      href="#"
                                      className="btn-primary mr-2"
                                      onClick={ e => {
                                        e.preventDefault();
                                        attendEvent(event._id, !(attendees?.includes(user._id)));
                                      }}
                                    >
                                    Cancel RSVP
                                    </a>:
                                    end && user && end.isBefore(dayjs()) &&
                                      <button
                                        onClick={ e => {
                                          e.preventDefault();
                                          attendEvent(event._id, !(attendees?.includes(user._id)));
                                        }}
                                        className="btn-primary mr-2"
                                      >
                                        Attend
                                      </button>
                        }
                      </>
                  }
                  {isAuthenticated && user.roles.includes('admin') &&
                    <a
                      className={`btn-primary inline-flex items-center ${featured?'active':''}`}
                      href="#"
                      title="Feature event"
                      onClick={ (e) => featureEvent(e, event._id, !featured) }
                    >
                      Feature event
                    </a>
                  }
                  {/* <AddToCalendar event={{
                    title: `${config.PLATFORM_NAME}: ${event.name}`,
                    description: event.description,
                    // location: 'Fábrica de Sonhos Tradicional, 7540-011, Abela, Santiago do Cacém, Portugal',
                    startTime: event.start,
                    endTime: event.end,
                  }} buttonLabel="Add to calendar" /> */}
                </div>
                {isAuthenticated && (user._id === event.createdBy || user.roles.includes('admin') || user.roles.includes('space-host')) &&
                  <div className="admin-actions mt-3 border-t pt-3">
                    { (user._id === event.createdBy || user.roles.includes('admin')) &&
                      <Link as={`/events/${event.slug}/edit`} href="/events/[slug]/edit">
                        <a className="btn-secondary text-xs mr-2">Edit event</a>
                      </Link>
                    }
                    { event.paid && (user._id === event.createdBy || user.roles.includes('admin') || user.roles.includes('space-host')) &&
                      <Link as={`/events/${event.slug}/tickets`} href="/events/[slug]/tickets">
                        <a className="btn-secondary text-xs mr-2">View tickets</a>
                      </Link>
                    }
                  </div>
                }
              </div>
            </div>
          </section>
          <main className="main-content max-w-prose event-page py-10">
            { ((event.partners && event.partners.length > 0) || (isAuthenticated && user._id === event.createdBy)) &&
              <section className="mb-6">
                <div className="flex flex-row flex-wrap justify-center items-center">
                  { event.partners && event.partners.map(partner => partner.photoUrl && (
                    <a href={ partner.url || '#' } target="_blank" rel="noreferrer" key={ partner.name } className="mr-3">
                      <Photo id={ partner.photo } photoUrl={ partner.photoUrl } className="w-32 h-16" title={ partner.name } />
                    </a>
                  )) }
                </div>
                {/* { (isAuthenticated && user._id === event.createdBy) &&
                  <div className="m-4">
                    <h3>Add partner</h3>
                    <form className="flex flex-row p-2" onSubmit={ e => addPartner(e, partnerToAdd) }>
                      <div className="w-2/3">
                        <input
                          type="text"
                          value={ partnerToAdd.name }
                          placeholder="Partner Name"
                          onChange={ e => setPartnerToAdd({ ...partnerToAdd, name: e.target.value }) }
                        />
                      </div>
                      <div className="w-1/3">
                        { partnerToAdd.photo && <Photo id={ partnerToAdd.photo } /> }
                        <div className="flex flex-row``">
                          <UploadPhoto
                            onSave={ photo => setPartnerToAdd({ ...partnerToAdd, photo }) }
                            label="Upload logo"
                          />
                          <button className="btn-primary">Add</button>
                        </div>
                      </div>
                    </form>
                  </div>
                } */}
              </section>
            }

            { attendees && attendees.length > 0 &&
              <EventAttendees event={event} user={user} start={start} attendees={attendees} platform={platform} />
            }

            { event.description && <section className="mb-6">
              <h3 className="font-bold text-2xl">Event description</h3>
              <p className="whitespace-pre-line">
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a
                      target="_blank"
                      rel="nofollow noreferrer"
                      href={decoratedHref}
                      key={key}
                      onClick={e => e.stopPropagation()}
                    >
                      {decoratedText}
                    </a>
                  )}
                >
                  {event.description}
                </Linkify>
              </p>
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </section> }
          </main>
        </div>
      }
    </Layout>
  );
}
Event.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: event } } = await api.get(`/event/${query.slug}`);
    // Test cases:
    // Event is ongoing
    // event.start = '2022-02-02T19:00:00.000Z';
    // event.end = '2029-04-02T19:00:00.000Z';
    // Event ended
    // event.start = '2022-02-02T19:00:00.000Z';
    // event.end = '2022-02-03T19:00:00.000Z';
    // Event is starting soon
    // event.start = '2022-03-02T21:00:00.000Z';
    // event.end = '2022-03-03T19:00:00.000Z';
    return { event };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Event;
