import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import { Fragment, useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/auth'
import { usePlatform } from '../contexts/platform'
import { __ } from '../utils/helpers'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar({ event }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { platform } = usePlatform()
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(event.start)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  const [speakers, setSpeakers] = useState(event && event.speakers);
  const [showForm, toggleShowForm] = useState(false)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState('')
  const params = useMemo(() => ({ sort_by: 'created' }), []);
  const users = platform.user.find(params);
  const totalUsers = platform.user.findCount(params);

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
      const { data } = await platform.event.patch(event._id,  { speakers: (speakers || []).concat({ name: name, description: description, startTime: startTime, endTime: endTime }) })
      setSpeakers(data.speakers)
      setName('')
      setDescription('')
      setStartTime('')
      setEndTime('')
      toggleShowForm(!showForm)
    } catch (err) {
      const error = err?.response?.data?.error || err.message;
    }
  }

  const deleteSpeaker = async (speaker) => {
    try {
      const { data } = await platform.event.patch(event._id,  { speakers: speakers.filter((item) => item.name !== speaker.name ) })
      setSpeakers(data.speakers) 
    } catch (err) {
      const error = err?.response?.data?.error || err.message;
    }
  };

  useEffect(() => {
    loadData();
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
                {selectedDay}
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {speakers.length > 0 ? (
                speakers.map((speaker) => (
                  <Speaker speaker={speaker} key={speaker.id} deleteSpeaker={deleteSpeaker} />
                ))
              ) : (
                <p>No speakers for today.</p>
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
                      <label>Speaker</label>
                      <select id='speaker' name='speaker' value={name} onChange={(e) => setName(e.target.value)} >
                        {users.map(user => (
                          <option value={ user.get('screenname') } key={ user.get('_id') }>
                            { user.get('screenname') }
                          </option>
                        ))}
                      </select >
                    </div>
                    <div>
                      <label>Description</label>
                      <input id='description'  type='text' placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)} />
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
        <p className="text-gray-900">{speaker.name}</p>
        <p className="text-gray-900">{speaker.description}</p>
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
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                    onClick={active && deleteSpeaker(speaker)}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  )
}

