
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Fragment, useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/auth'
import { usePlatform } from '../contexts/platform'
import { __ } from '../utils/helpers'
import { TiDelete } from '@react-icons/all-files/ti/TiDelete'
import { TiEdit } from '@react-icons/all-files/ti/TiEdit'
import { TiHeartFullOutline } from '@react-icons/all-files/ti/TiHeartFullOutline'
import { TiHeartOutline } from '@react-icons/all-files/ti/TiHeartOutline'
import { format, parseISO } from 'date-fns'

dayjs.extend(advancedFormat)


export default function EventSchedule({ event }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { platform } = usePlatform()
  const [speakers, setSpeakers] = useState(event && (event.speakers || []));
  const [showForm, toggleShowForm] = useState(false)
  const [showEdit, toggleShowEdit] = useState(false)
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const params = useMemo(() => ({ sort_by: 'created' }), []);
  const users = platform.user.find(params);
  const startDate = event && event.start && dayjs(event.start);
  const endDate = event && event.end && dayjs(event.end);

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
      const speakerObj = new Object({ title: title, name: name, description: description, url: url, start: start, end: end })
      const { data } = await platform.event.patch(event._id,  { speakers: (speakers || []).concat(speakerObj) })
      setSpeakers(data && data.speakers)
      setTitle('')
      setName('')
      setDescription('')
      setUrl('')
      setStart('')
      setEnd('')
      toggleShowForm(!showForm)
      toggleShowEdit(!showEdit)
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

  const editSpeaker = async (speaker) => {
    try {
      setTitle(speaker.title)
      setName(speaker.name)
      setDescription(speaker.description)
      setUrl(speaker.url)
      setStart(speaker.start)
      setEnd(speaker.end)
      toggleShowForm(!showForm)
      toggleShowEdit(!showEdit)
      deleteSpeaker(speaker)
    } catch (err) {
      console.error(err)
    }
  }
  

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
                { startDate && startDate.format('MMMM Do') }
                { endDate && ` - ${ endDate.format('MMMM Do') }` }
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {speakers.length > 0 ? (
                speakers.map((speaker, index) => (
                  <Speaker speaker={speaker} key={index} deleteSpeaker={deleteSpeaker} editSpeaker={editSpeaker} />
                ))
              ) : (
                <p>No speakers for this day.</p>
              )}
            </ol>
          </section>
          { isAuthenticated &&
                    <div className='mt-12 md:pl-14'>
                      <a name='Add Speaker' onClick={(e) => {e.preventDefault(); toggleShowForm(!showForm) }}>
                        <button className='btn-primary'>Add Speaker</button>
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
                      <input id='title'  type='text' placeholder='Tokenomics' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                      <label>Speaker</label>
                      <input id='speaker'  type='text' placeholder='Samuel Deleshque' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label>Description</label>
                      <input id='description'  type='text' placeholder='NFTs and token governance' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                      <label>Location</label>
                      <input id='location'  type='text' placeholder='zoom.com/tokens' value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div>
                    <div>
                      <label>Start Time</label>
                      <input id='start-time'  type='datetime-local'  value={start} onChange={(e) => setStart(e.target.value)} />
                    </div>
                    <div>
                      <label>End Time</label>
                      <input id='end-time'  type='datetime-local' value={end} onChange={(e) => setEnd(e.target.value)} />
                    </div>
                    <div className='flex flex-row items-center justify-start'>
                      <button type='submit' className='btn-primary w-24 mr-6'>{ showEdit ? 'Add' : 'Save' }</button>
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

function Speaker({ speaker, deleteSpeaker, editSpeaker }) {


  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const startDate = parseISO(speaker.start)
  const endDate = parseISO(speaker.end)

  const likePost = () => {
    setLiked(!liked)
    if (!liked) {
      setLikes(likes + 1)
    }
    else {
      setLikes(likes - 1)
    }
  };

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <div className="flex-auto">
        <h4 className="text-gray-900">{speaker.title}</h4>
        <p className="text-gray-900 text-lg">{speaker.name}</p>
        <p className="text-gray-900">{speaker.description}</p>
        <p className="text-gray-900">{speaker.url}</p>
        <p className="mt-0.5">
          <time>
            {format(startDate, 'MMMM do h:mm a')}
          </time>{' '}
          -{' '}
          <time>
            {format(endDate, 'h:mm a')}
          </time>
        </p>
      </div>
      <div
        className="flex items-center space-x-1"
        onClick={(e) => {
          e.stopPropagation();
          likePost();
        }}
      >
        <div>
          {liked ? (
            <TiHeartFullOutline className="h-5 text-pink-600 text-lg hover:cursor-pointer hidden group-hover:block" />
          ) : (
            <TiHeartOutline className="h-5 group-hover:text-pink-600 text-lg hover:cursor-pointer hidden group-hover:block" />
          )}
        </div>
        {likes > 0 && (
          <span
            className={`group-hover:text-pink-600 text-xs hidden group-hover:block ${
              liked && 'text-pink-600'
            }`}
          >
            {likes}
          </span>
        )}
      </div>
      <a onClick={(e) => {e.preventDefault(); editSpeaker(speaker)}} >
        <TiEdit className='text-gray-500 text-lg hover:text-black hover:cursor-pointer hidden group-hover:block' />
      </a>
      <a onClick={(e) => {e.preventDefault(); deleteSpeaker(speaker)}} >
        <TiDelete className='text-gray-500 text-lg hover:text-black hover:cursor-pointer hidden group-hover:block' />
      </a>
    </li>
  )
}

