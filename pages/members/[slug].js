import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { FaUser } from '@react-icons/all-files/fa/FaUser';
import { FaRegEdit } from '@react-icons/all-files/fa/FaRegEdit';


import Layout from '../../components/Layout';
import UploadPhoto from '../../components/UploadPhoto';
import EventsList from '../../components/EventsList';

import api, { formatSearch, cdn } from '../../utils/api';
import PageNotFound from '../404';
import { useAuth } from '../../contexts/auth.js'
import { usePlatform } from '../../contexts/platform';
import { __ } from '../../utils/helpers';

const MemberPage = ({ member, loadError }) => {
  const [photo, setPhoto] = useState(null);
  const [introMessage, setMessage] = useState('');
  const [openIntro, setOpenIntro] = useState(false);
  const [error, setErrors] = useState(false);
  const [sendError, setSendErrors] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const { user: currentUser, isAuthenticated } = useAuth();
  const [about, setAbout] = useState(member && member.about);
  const [tagline, setTagline] = useState(member && member.tagline);
  const [showForm, toggleShowForm] = useState(false)
  const [editProfile, toggleEditProfile] = useState(false);
  const image = (photo || member.photo);
  const { platform } = usePlatform();
  const  links = platform.user.find(currentUser?._id)?.get('links') || member.links;


  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await platform.user.patch(currentUser._id,  { links: (currentUser.links || []).concat({ name: linkName, url: linkUrl }) })
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = (event) => {
    event.preventDefault()
    saveAbout(about);
    saveTagline(tagline)
    toggleEditProfile(!editProfile)
  }

  const saveAbout = async (about) => {
    try {
      const { data: { results: savedData } } = await api.patch(`/user/${member._id}`, { about });
      setAbout(savedData.about);
      setErrors(null);
    } catch (err) {
      const error = err?.response?.data?.error || err.message;
      setErrors(error);
    }
  }

  const saveTagline = async (tagline) => {
    try {
      const { data: { results: savedData } } = await api.patch(`/user/${member._id}`,  { tagline });
      setTagline(savedData.tagline)
      setErrors(null);
    } catch (err) {
      const error = err?.response?.data?.error || err.message;
      setErrors(error);
    }
  }

  const sendMessage = async (content) => {
    try {
      setSendErrors(null);
      await api.post('/message', { content, visibleBy: [member._id] });
      setOpenIntro(false);
    } catch (err) {
      const error = err?.response?.data?.error || err.message;
      setSendErrors(error);
    }
  }

  useEffect(() => {
    setAbout(member.about);
    setTagline(member.tagline)
  }, [member]);

  if (!member) {
    return <PageNotFound error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>{ member.screenname }</title>
      </Head>
      <div className='main-content'>
        <main className="flex flex-col justify-between">
          { openIntro &&
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline">
            <div className="relative w-11/12 my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col space-x-5 w-full bg-background outline-none focus:outline-none p-10">
                { sendError && <p className="validation-error">{ __('members_slug_error') } { sendError }</p> }
                <form
                  onSubmit={ (e) => {
                    e.preventDefault();
                    sendMessage(introMessage);
                  }}
                >
                  <label>{ __('members_slug_contact') } {member.screenname}</label>
                  <textarea
                    placeholder="Type your message"
                    onChange={ e => {
                      setMessage(e.target.value);
                    } }
                    value={ introMessage }
                    className='w-full h-32'
                  />
                  <button type="submit" className='btn-primary mt-8 mr-2'>{ __('members_slug_send') }</button>{' '}
                  <a
                    href="#"
                    onClick={ (e) => {
                      e.preventDefault();
                      setOpenIntro(false);
                    }}
                  >
                    { __('members_slug_cancel') }
                  </a>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
          }

          <Link  href={'/members'}>
            <p className="text-lg cursor-pointer my-4">
              {'< All Profiles'}
            </p>
          </Link>

          <div className='flex flex-col md:flex-row items-start'>

            <div className='flex flex-col items-start space-y-5 md:w-full md:mt-3'>
              <div className='flex flex-col md:flex-row w-full'>
                <div className='md:w-72 items-center justify-start relative top-0 right-0'>
                  <div className="flex mb-4 md:mr-8 md:justify-center items-center">
                    {member.photo?
                      <img
                        src={`${cdn}${member.photo}-profile-lg.jpg`}
                        loading="lazy"
                        alt={ member.screenname }
                        className="w-32 md:w-44 mt-4 md:mt-0 rounded-full"
                      />:
                      <FaUser className="text-gray-200 text-6xl" />
                    }
                  </div>
                  <div className="absolute top-0 bottom-0 right-6 left-0 items-center h-full opacity-0 hover:opacity-80">
                    { isAuthenticated && member._id === currentUser._id && <UploadPhoto
                      model="user"
                      id={member._id}
                      onSave={id => setPhoto(id)}
                      label={ member.photo ? 'Change photo': 'Add photo' }
                    /> }
                  </div>
                </div>

                <div className="flex flex-col items-start w-full">
                  <h3 className='font-medium text-5xl md:text-6xl md:w-6/12 flex flex-wrap'>
                    {member.screenname}
                  </h3>

                  { isAuthenticated && member._id !== currentUser._id &&
                <div className="my-3">
                  <a
                    href="#"
                    onClick={ (e) => {
                      e.preventDefault();
                      setOpenIntro(!openIntro);
                    }}
                    className="btn-primary"
                  >
                    { __('members_slug_get_introduced') }
                  </a>
                </div>
                  }

                  <div className='mt-1 w-full'>
                    { editProfile?
                      <textarea
                        autoFocus
                        value={tagline}
                        className="w-10/12 h-20"
                        onChange={ (e) => setTagline(e.target.value) }
                        onBlur={ () => {
                          saveTagline(tagline);
                        } }
                      />:
                      (isAuthenticated && member._id === currentUser._id) ?
                        <p className="mt-6 w-10/12" >
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
                            { tagline }
                            { !tagline &&
                        <span className="placeholder">{ __('members_slug_tagline_prompt') }</span>
                            }
                          </Linkify>
                        </p>:
                        <p className="" >
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
                            { tagline }
                            { !tagline &&
                        <span className="placeholder">{ member.screenname } { __('members_slug_tagline_empty') }</span>
                            }
                          </Linkify>
                        </p>
                    }
                    <div className="font-semibold text-sm mt-1">
                      {member.timezone}
                    </div>
                  </div>
                </div>
              </div>

              { error && <p className="validation-error">Error: { error }</p> }
              { editProfile?
                <textarea
                  autoFocus
                  value={about}
                  className="w-10/12 h-36"
                  onChange={ (e) => setAbout(e.target.value) }
                  onBlur={ () => {
                    saveAbout(about);
                  } }
                />:
                (isAuthenticated && member._id === currentUser._id) ?
                  <p className="mt-6 w-full md:w-8/12" >
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
                      { about }
                      { !about &&
                      <span className="placeholder">{ __('members_slug_about_prompt') }</span>
                      }
                    </Linkify>
                  </p>:
                  <p className="" >
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
                      { about }
                      { !about &&
                      <span className="placeholder">{ member.screenname } { __('members_slug_about_empty') }</span>
                      }
                    </Linkify>
                  </p>
              }

              { isAuthenticated && member._id === currentUser._id &&
                <button type="button" className="btn-primary w-24" onClick={handleClick}>
                  {editProfile ? 'Save' : 'Edit'}
                </button>
              }

            </div>

            <div className="flex flex-col items-start md:w-6/12">
              <div>
                <div className="page-title flex justify-between">
                  <h3 className="mt-16 md:mt-3 mb-4">Meet {member.screenname} at:</h3>
                </div>

                <EventsList
                  limit={ 7 }
                  list
                  showPagination={ false }
                  where={{
                    attendees: member._id,
                    visibility: 'public'
                  }}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col items-start mb-10">
                  <div className='flex flex-row items-center justify-between mt-8'>
                    <p className='font-semibold text-md mr-5'>{ __('members_slug_stay_social') }</p>
                    { isAuthenticated && member._id === currentUser._id &&
                      <a href="#" onClick={(e) => {e.preventDefault(); toggleShowForm(!showForm) }}>
                        <FaRegEdit />
                      </a>
                    }
                  </div>
                  <ul className='space-y-1 mt-4'>
                    {links ? links.map((link) => (
                      <li key={link._id} className="mb-1">
                        <a href={link.url}>
                          {link.name}
                        </a>
                      </li>
                    )):
                      'No links yet'
                    }

                  </ul>
                </div>


                { isAuthenticated && member._id === currentUser._id && showForm &&
          <>
            <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline">
              <div className="relative w-11/12 my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col space-x-5 w-full bg-background outline-none focus:outline-none p-10">
                  <form className='flex flex-col space-y-7 w-full' onSubmit={handleSubmit}>
                    <div>
                      <label>{ __('members_slug_links_name') }</label>
                      <input id='name'  type='text' placeholder='Name...' value={linkName} onChange={(e) => setLinkName(e.target.value)} required />
                    </div>
                    <div>
                      <label>{ __('members_slug_links_url') }</label>
                      <input id='url'  type='text' placeholder='Url...' value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
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
                  Cancel
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
        </main>
      </div>
    </Layout>
  );
}

MemberPage.getInitialProps = async ({ req, query }) => {
  try {
    const res = await api.get(`/user/${query.slug}`);

    return {
      member: res.data.results
    };
  } catch (err) {
    console.log('Error', err.message);

    return {
      loadError: err.message
    };
  }
}

export default MemberPage;
