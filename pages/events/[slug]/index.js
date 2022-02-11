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
import PageNotFound from '../../404';
import { useAuth } from '../../../contexts/auth';
import { usePlatform } from '../../../contexts/platform';

dayjs.extend(advancedFormat)

const Event = ({ event, error }) => {

  const [photo, setPhoto] = useState(event.photo);
  const [loadError, setErrors] = useState(null);
  const { platform } = usePlatform();
  const { user, isAuthenticated } = useAuth();
  const [attendees, setAttendees] = useState(event.attendees || []);
  const [ticketsSold, setTicketsSold] = useState([]);
  const ticketsFilter = { where: { event: event._id, status: 'approved' } };
  const myTicketFilter = { where: { event: event._id, status: 'approved', email: user && user.email } };
  const start = event.start && dayjs(event.start);
  const end = event.end && dayjs(event.end);
  const duration = end.diff(start, 'hour', true);
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

  useEffect(() => {
    loadData();
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
      <section className="py-5">
        <div className="main-content md:flex flex-row justify-center items-center">
          <div className="md:w-1/2 md:mr-4 mb-4 relative bg-gray-200 h-80">
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
            <h1 className="text-4xl mt-4 font-bold">{event.name}</h1>
            { loadError && <div className="validation-error">{loadError}</div> }

            <div className="mt-4 event-actions">
              { event.paid ?
                <>
                  { myTickets && myTickets.count() > 0 ?
                    <Link as={`/tickets/${myTickets.first().get('_id')}`} href="/tickets/[slug]">
                      <a className="btn-primary mr-2">See ticket</a>
                    </Link>:
                    event.ticket ?
                    <Link href={ prependHttp(event.ticket) }>
                      <a className="btn-primary mr-2" target="_blank" rel="noreferrer nofollow">Buy ticket</a>
                    </Link>:
                    <Link as={`/events/${event.slug}/checkout`} href="/events/[slug]/checkout">
                      <a className="btn-primary mr-2">Buy ticket</a>
                    </Link>
                  }
                </>:
                <>
                  { isAuthenticated && attendees?.includes(user._id) ?
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
                    isAuthenticated && <button
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

              {(isAuthenticated) && user._id === event.createdBy &&
                <Link as={`/events/edit/${event.slug}`} href="/events/edit/[slug]">
                  <a className="btn-primary mr-2">Edit event</a>
                </Link>
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
      <main className="main-content event-page py-10">
        <section className="attendees card-body mb-6">
          <h3 className="text-2xl font-bold">Who&apos;s coming?</h3>
          { event.price || event.ticketOptions?
              <div className="-space-x-3 flex flex-row flex-wrap">
                { attendees && attendees.map((_id) => {
                  const attendee = platform.user.findOne(_id);
                  if (!attendee) {
                    return null;
                  }

                  return (
                    <Link key={ attendee.get('_id') } as={`/members/${attendee.get('slug')}`} href="/members/[slug]">
                      <a className="from user-preview">
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
        </section>

        <section className="mb-6">
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
        </section>
        {/* <section>
          <PostList
            allowCreate
            visibility="public"
            parentId={ event._id }
            parentType="event"
            channel={ event.category }
          />
        </section> */}
      </main>
    </Layout>
  );
}
Event.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: event } } = await api.get(`/event/${query.slug}`);
    return { event };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Event;
