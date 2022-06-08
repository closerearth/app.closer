
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Fragment, useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/auth'
import { usePlatform } from '../contexts/platform'
import { __ } from '../utils/helpers'
import { TiDelete } from '@react-icons/all-files/ti/TiDelete'

dayjs.extend(advancedFormat)


export default function Calendar({ event }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { platform } = usePlatform()
  const [speakers, setSpeakers] = useState(event && (event.speakers || []));
  const [showForm, toggleShowForm] = useState(false)
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const params = useMemo(() => ({ sort_by: 'created' }), []);
  const users = platform.user.find(params);
  const start = event && event.start && dayjs(event.start);

  const loadData = async () => {
    try {
      await Promise.all([
        platform.user.get(params),
        platform.user.getCount(params)
      ]);
    } catch (err) {
      console.log('Load error', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const speakerObj = new Object({ title: title, name: name, description: description, location: location, startTime: startTime, endTime: endTime })
      const { data } = await platform.event.patch(event?._id,  { speakers: (speakers || []).concat(speakerObj) })
      setSpeakers(data.speakers)
      setName('')
      setDescription('')
      setStartTime('')
      setEndTime('')
      toggleShowForm(!showForm)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteSpeaker = async (speaker) => {
    try {
      const { data } = await platform.event.patch(event._id,  { speakers: speakers.filter((item) => item.name !== speaker.name ) })
      setSpeakers(data.speakers) 
    } catch (err) {
      console.error(err)
    }
  };
  

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSpeakers(event.speakers)
  }, [event]);



  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:divide-x md:divide-gray-200">
          <section className="mt-12 md:pl-14">
            <h2 className="font-semibold text-gray-900">
              Schedule for{' '}
              <time>
                { start && start.format('MMMM Do') }
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {speakers.length > 0 ? (
                speakers.map((speaker, index) => (
                  <Speaker speaker={speaker} key={index} deleteSpeaker={deleteSpeaker} />
                ))
              ) : (
                <p>No speakers for this day.</p>
              )}
            </ol>
          </section>
          { isAuthenticated &&
                    <div className='mt-12 md:pl-14'>
                      <a href="#" name='Add Speaker' onClick={(e) => {e.preventDefault(); toggleShowForm(!showForm) }}>
                        <button className='btn-small'>Add Speaker</button>
                      </a>
                    </div>
          }
          { isAuthenticated  && showForm &&
          <>
            <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline">
              <div className="relative w-11/12 my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-background outline-none focus:outline-none p-10">
                  <h2 className="self-center text-lg font-normal mb-3">Add Session</h2>
                  <form className='flex flex-col space-y-7 w-full p-2' onSubmit={handleSubmit} >
                    <div>
                      <label>Session Title</label>
                      <input id='title'  type='text' placeholder='Title...' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                      <label>Speaker</label>
                      {/* <select id='speaker' name='speaker' value={name} onChange={(e) => setName(e.target.value)} >
                        {users.map(user => (
                          <option value={ user.get('screenname') } key={ user.get('_id') }>
                            { user.get('screenname') }
                          </option>
                        ))}
                      </select > */}
                      <input id='speaker'  type='text' placeholder='Speaker...' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label>Description</label>
                      <input id='description'  type='text' placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                      <label>Location</label>
                      <input id='location'  type='text' placeholder='Location...' value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div>
                      <label>Start Time</label>
                      <input id='start-time'  type='time'  value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div>
                      <label>End Time</label>
                      <input id='end-time'  type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                    <div className='flex flex-row items-center justify-start'>
                      <button type='submit' className='btn-primary w-24 mr-6'>{ __('members_slug_links_submit') }</button>
                      <a
                        href="#"
                        onClick={ (e) => {
                          e.preventDefault();
                          toggleShowForm(!showForm);
                        }}
                      >
                        { __('generic_cancel') }
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
          }
        </div>
      </div>
    </div>
  )
}

function Speaker({ speaker, deleteSpeaker }) {

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {/* <img
        src={speaker.photo}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      /> */}
      <div className="flex-auto">
        <h4 className="text-gray-900">{speaker.title}</h4>
        <p className="text-gray-900 text-lg">{speaker.name}</p>
        <p className="text-gray-900">{speaker.description}</p>
        <p className="text-gray-900">{speaker.location}</p>
        <p className="mt-0.5">
          <time>
            {speaker.startTime}
          </time>{' '}
          -{' '}
          <time>
            {speaker.endTime}
          </time>
        </p>
      </div>
      <a href='#' onClick={(e) => {e.preventDefault(); deleteSpeaker(speaker)}} >
        <TiDelete className='text-gray-500 text-lg hover:text-black hidden group-hover:block' />
      </a>
    </li>
  )
}

