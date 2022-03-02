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
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';

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
      const {data: { results: event }} = await api.post(`/attend/event/${_id}`, { attend });
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
          </div>
        </div>:
        <div>
          <section className="py-5">
            <div className="main-content md:flex flex-row justify-center items-center">
              <div className="md:w-1/2 md:mr-4 mb-4 relative bg-gray-200 md:h-80">
                { photo && <img
                  className="object-cover md:h-full md:w-full"
                  src={ `${cdn}${photo}-max-lg.jpg` }
                  alt={ event.name }
                /> }
                { (isAuthenticated && user._id === event.createdBy) &&
                  <div className="absolute left-0 top-0 bottom-0 right-0 flex items-center justify-center opacity-0 hover:opacity-80">
                    <UploadPhoto
                      model="event"
                      id={event._id}
                      onSave={id => setPhoto(id)}
                      label={ photo ? 'Change photo': 'Add photo' }
                    />
                  </div>
                }
              </div>
              <div className="md:w-1/2 p-2">
                <h2 className="text-xl font-light">
                  { start && start.format(dateFormat) }
                  { end && duration > 24 && ` - ${ end.format(dateFormat) }` }
                  { end && duration <= 24 && ` - ${ end.format('HH:mm') }` }
                </h2>
                <h1 className="md:text-4xl mt-4 font-bold">{event.name}</h1>
                { loadError && <div className="validation-error">{loadError}</div> }

                <div className="mt-4 event-actions flex items-center">
                  {
                    start.isAfter(dayjs()) &&
                    <span className="p3 mr-2 italic">
                      Event is happening{' '}
                      <TimeSince
                        time={ event.start }
                      />
                    </span>
                  }
                  { event.paid ?
                    <>
                      { myTickets && myTickets.count() > 0 ?
                        <Link as={`/tickets/${myTickets.first().get('_id')}`} href="/tickets/[slug]">
                          <a className="btn-primary mr-2">See ticket</a>
                        </Link>:
                        event.ticket && start.isAfter(dayjs()) ?
                        <Link href={ prependHttp(event.ticket) }>
                          <a className="btn-primary mr-2" target="_blank" rel="noreferrer nofollow">Buy ticket</a>
                        </Link>:
                        start.isAfter(dayjs())?
                        <Link as={`/events/${event.slug}/checkout`} href="/events/[slug]/checkout">
                          <a className="btn-primary mr-2">Buy ticket</a>
                        </Link>:
                        null
                      }
                    </>:
                    <>
                      {
                        start.isBefore(dayjs()) && end.isAfter(dayjs()) && event.location?
                        <a className="btn-primary mr-2" href={ event.location }>Hop on!</a>:
                        start.isBefore(dayjs()) && end.isAfter(dayjs()) ?
                        <span className="p3 mr-2" href={ event.location }>ONGOING</span>:
                        !isAuthenticated ?
                        <Link as={`/signup?back=${encodeURIComponent(`/events/${event.slug}`)}`} href="/signup">
                          <a className="btn-primary mr-2">Signup to RSVP</a>
                        </Link>:
                        end.isBefore(dayjs()) ?
                        start.isAfter(dayjs()) && end.isBefore(dayjs()) && event.location ?
                        <a className="btn-primary mr-2" href={ event.location }>Hop on!</a>:
                        <span className="p3 mr-2 italic">This event has ended.</span>:
                        attendees?.includes(user._id) ?
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

                  {isAuthenticated && user._id === event.createdBy &&
                    <Link as={`/events/edit/${event.slug}`} href="/events/edit/[slug]">
                      <a className="btn-primary mr-2">Edit event</a>
                    </Link>
                  }
                  {isAuthenticated && user.roles.includes('admin') &&
                    <a
                      className={`btn-primary inline-flex items-center ${featured?'active':''}`}
                      href="#"
                      title="Feature event"
                      onClick={ (e) => featureEvent(e, event._id, !featured) }
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
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

            { attendees && attendees.length > 0 && <section className="attendees card-body mb-6">
              <h3 className="text-2xl font-bold">Who&apos;s coming?</h3>
              { event.price || event.ticketOptions?
                  <div className="-space-x-3 flex flex-row flex-wrap">
                    { Array.from(new Set(attendees)).map((_id) => {
                      const attendee = platform.user.findOne(_id);
                      if (!attendee) {
                        return null;
                      }

                      return (
                        <Link key={ attendee.get('_id') } as={`/members/${attendee.get('slug')}`} href="/members/[slug]">
                          <a className="from user-preview z-10">
                            <ProfilePhoto size="sm" user={attendee.toJS()} />
                            {/* <span className="name">{ user.get('screenname') }</span> */}
                          </a>
                        </Link>
                      );
                    })
                  }
                </div>:
                  platform && attendees.length > 0 ?
                  <div>
                    { attendees.map(uid => {
                      const attendee = platform.user.findOne(uid);
                      if (!attendee) {
                        return null;
                      }

                      return (
                        <Link key={ uid } as={`/members/${attendee.get('slug')}`} href="/members/[slug]">
                          <a className="from user-preview">
                            <ProfilePhoto size="sm" user={attendee.toJS()} />
                            <span className="name">{ attendee.get('screenname') }</span>
                          </a>
                        </Link>
                      );
                    })
                  }
                </div>:
                'No results'
              }
            </section> }

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
