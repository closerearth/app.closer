import React from "react";
import Link from "next/link";

import ProfilePhoto from "./ProfilePhoto";
import TimeSince from "./TimeSince";


const EventInformation = ({event, user, start, end, platform, dayjs, myTickets, prependHttp, isAuthenticated, encodeURIComponent, attendees, attendEvent, featured, featureEvent}) => {
    return (<div className="flex flex-col md:flex-row items-center justify-between w-full md:ml-full md:mr-full pb-12 pt-6 border-b border-black">
              <div className="hidden md:flex w-5/12">
              </div>
              <div className="flex flex-col items-start justify-start w-full md:w-7/12">
               <div className="flex flex-col md:flex-row items-start justify-between w-full">
                <div className="flex flex-col w-full md:w-1/2">
                    <p className="font-extralight text-gray-400">From</p>
                    <p className="w-10/12">{`${start} to ${end}`}</p>
                    <p className="font-extralight text-gray-400 mt-4">Location</p>
                    <p>{event.location}</p>
                  <button className="btn-primary w-72 h-full mt-8">Get tickets</button>
                </div>
                <div className="flex flex-col w-full md:w-1/2 mt-10 md:mt-0">
                  <p className="font-extralight text-gray-400">{"Who's coming"}</p>
                  <div>
                  {platform && attendees.length > 0 ? <div className="grid grid-flow-col-dense gap-3 w-fit mt-2">
                  {attendees.map(uid => {
            const attendee = platform.user.findOne(uid);

            if (!attendee) {
              return <p>No attendees</p>;
            }

            return <Link key={uid} as={`/members/${attendee.get("slug")}`} href="/members/[slug]">
                        <a className="from user-preview">
                          <ProfilePhoto size="sm" user={attendee.toJS()} />
                        </a>
                      </Link>;
          })}
                </div> : "No results"}
                  </div>
                </div>
                </div>

                <div className="mt-12 event-actions flex flex-wrap items-center w-full">
                {start.isAfter(dayjs()) && <span className="p3 mr-2 italic">
                    Event is happening <TimeSince time={event.start} />
                  </span>}
                {event.paid ? <>
                    {myTickets && myTickets.count() > 0 ? <Link as={`/tickets/${myTickets.first().get("_id")}`} href="/tickets/[slug]">
                        <a className="btn-primary mr-2">See ticket</a>
                      </Link> : event.ticket && start.isAfter(dayjs()) ? <Link href={prependHttp(event.ticket)}>
                        <a className="btn-primary mr-2" target="_blank" rel="noreferrer nofollow">
                          Buy ticket
                        </a>
                      </Link> : start.isAfter(dayjs()) ? <Link as={`/events/${event.slug}/checkout`} href="/events/[slug]/checkout">
                        <a className="btn-primary mr-2">Buy ticket</a>
                      </Link> : null}
                  </> : <>
                    {start.isBefore(dayjs()) && end.isAfter(dayjs()) && event.location ? <a className="btn-primary mr-2" href={event.location}>
                        Hop on!
                      </a> : start.isBefore(dayjs()) && end.isAfter(dayjs()) ? <span className="p3 mr-2" href={event.location}>
                        ONGOING
                      </span> : !isAuthenticated ? <Link as={`/signup?back=${encodeURIComponent(`/events/${event.slug}`)}`} href="/signup">
                        <a className="btn-primary mr-2">Signup to RSVP</a>
                      </Link> : end.isBefore(dayjs()) ? start.isAfter(dayjs()) && end.isBefore(dayjs()) && event.location ? <a className="btn-primary mr-2" href={event.location}>
                          Hop on!
                        </a> : <span className="p3 mr-2 italic">
                          This event has ended.
                        </span> : attendees?.includes(user._id) ? <a href="#" className="btn-primary mr-2" onClick={e => {
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

                {isAuthenticated && user._id === event.createdBy && <Link as={`/events/edit/${event.slug}`} href="/events/edit/[slug]">
                    <a className="btn-primary mr-2">Edit event</a>
                  </Link>}
                {isAuthenticated && user.roles.includes("admin") && <a className={`btn-primary inline-flex items-center ${featured ? "active" : ""}`} href="#" title="Feature event" onClick={e => featureEvent(e, event._id, !featured)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </a>}
              </div>
              </div>
            </div>);
  }
  
export default EventInformation;