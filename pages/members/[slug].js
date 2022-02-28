import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from '../../components/Layout';
import UploadPhoto from '../../components/UploadPhoto';
import UpcomingEvents from '../../components/UpcomingEvents';

import api, { formatSearch, cdn } from '../../utils/api';
import PageNotFound from '../404';
import { useAuth } from '../../contexts/auth.js'
import { usePlatform } from '../../contexts/platform';

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
  const [editProfile, toggleEditProfile] = useState(false);
  const image = (photo || member.photo);
  const { platform } = usePlatform()
  const links = platform.user.find(currentUser?._id)?.get('links') || []
  
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
      <div className='main-content bg-slate-50'>
      <main className="flex flex-col justify-between">
        { openIntro &&
          <div className="introduction">
            <div className="main-content">
              { sendError && <p className="validation-error">Error: { sendError }</p> }
              <form
                onSubmit={ (e) => {
                  e.preventDefault();
                  sendMessage(introMessage);
                }}
              >
                <label>Contact {member.screenname}</label>
                <textarea
                  placeholder="Type your message"
                  onChange={ e => {
                    setMessage(e.target.value);
                  } }
                  value={ introMessage }
                />
                <button type="submit">Send</button>{' '}
                <a
                  href="#"
                  onClick={ (e) => {
                    e.preventDefault();
                    setOpenIntro(false);
                  }}
                >
                  Cancel
                </a>
              </form>
            </div>
          </div>
        }

        <div className='flex flex-col md:flex-row items-start'>

        <div className='flex flex-col items-start space-y-5 md:w-full'>

            <Link  href={'/members'}>
              <p className="text-lg cursor-pointer">
            {'< All Profiles'}
              </p>
            </Link>


            <div className='flex flex-col md:flex-row w-full'>
            <div className='md:w-72 items-center justify-start'>
            <div>
              <img src={member.photo? `${cdn}${member.photo}-profile-sm.jpg` : '../../images/icons/user-icon.png'} loading="lazy" alt="this is an image" className="w-32 md:w-44 mt-4 md:mt-0 rounded-full cursor-pointer transition duration-150 transform hover:scale-110" />
            </div>
            <div className='mt-1 mb-3 justify-self-start' >
              { isAuthenticated && member._id === currentUser._id && <UploadPhoto
                model="user"
                id={member._id}
                onSave={id => setPhoto(id)}
                label={ member.photo ? 'Change photo': 'Add photo' }
                
              /> }
            </div>
            </div>

         

          <div className="flex flex-col items-start w-full">
            <h3 className='font-medium text-4xl md:text-7xl md:w-8/12 '>
              {member.screenname}{' '}
              { isAuthenticated && member._id !== currentUser._id &&
                <a
                  href="#"
                  onClick={ (e) => {
                    e.preventDefault();
                    setOpenIntro(!openIntro);
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelope}/>
                </a>
              }
            </h3>
            
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
                      <span className="placeholder">Please write a tagline.</span>
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
                      <span className="placeholder">{ member.screenname } has not yet set a tagline</span>
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
                    { about }
                    { !about &&
                      <span className="placeholder">Tell us more about you.</span>
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
                      <span className="placeholder">{ member.screenname } has not yet set a description</span>
                    }
                </Linkify>
              </p>
            }

              { isAuthenticated && member._id === currentUser._id &&
               <button type='button' className='btn-primary w-24' onClick={handleClick}>{editProfile ? "Save" : "Edit"}</button> }

            </div>

      <div className="flex flex-col items-start md:w-2/3">
       <div>
        <div className="page-title flex justify-between">
          <h3 className="mt-16 md:mt-10 mb-4">Upcoming events {member.screenname} is going to:</h3>
        </div>
        
        <UpcomingEvents
          allowCreate
          limit={ 30 }
          page={ 1 }
          labelLink={null}
          list={true}
        />
       </div>
        
        <div className="flex flex-col">
          <div className="flex flex-col items-start mb-10">
             <p className='font-semibold text-md mt-8'>Stay Social</p>
             <ul className='space-y-1 mt-4'>
               {console.log(links)}
               {links ? links.map((link) => {
               <li className='bg-black'><a href={link.url}>{link.name}</a></li>
               })
               : 'No links yet'
               }
             </ul>
          </div>
          { isAuthenticated && member._id === currentUser._id &&
          <div className="flex items-start mb-10 border border-line p-4 w-fit">
              <form className='flex flex-col space-y-6 w-96' onSubmit={handleSubmit}>
                <input id='name'  type='text' placeholder='Name...' value={linkName} onChange={(e) => setLinkName(e.target.value)} required />
                <input id='url'  type='url' placeholder='Url...' value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
                <button type='submit' className='btn-primary w-24 self-center'>Save</button>
              </form>
          </div>
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
