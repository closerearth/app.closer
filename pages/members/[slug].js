import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from '../../components/Layout';
import UploadPhoto from '../../components/UploadPhoto';

import api, { formatSearch, cdn } from '../../utils/api';
import PageNotFound from '../404';
import { useAuth } from '../../contexts/auth.js'

const MemberPage = ({ member, loadError }) => {
  const [photo, setPhoto] = useState(null);
  const [introMessage, setMessage] = useState('');
  const [openIntro, setOpenIntro] = useState(false);
  const [editAbout, toggleEditAbout] = useState(false);
  const [error, setErrors] = useState(false);
  const [sendError, setSendErrors] = useState(false);
  const { user: currentUser, isAuthenticated } = useAuth();
  const [about, setAbout] = useState(member && member.about);

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
  }, [member]);

  if (!member) {
    return <PageNotFound error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>{ member.screenname }</title>
      </Head>
      <main className="main-content">
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
        <div className="flex flex-col items-start">
          <div className="flex flex-col">
            <div>
              <img src={`${cdn}${member.photo}-profile-sm.jpg`} loading="lazy" alt="this is an image" className="h-18 mt-6 rounded-full animate-bounce cursor-pointer transition duration-150 transform hover:scale-110" />
            </div>
            <div>
              { isAuthenticated && member._id === currentUser._id && <UploadPhoto
                model="user"
                id={member._id}
                onSave={id => setPhoto(id)}
                label={ member.photo ? 'Change photo': 'Add photo' }
              /> }
            </div>
          </div>
          <div className="col col-spacer" />
          <div className="col lg">
            <h3 className='font-medium text-4xl'>
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
            { error && <p className="validation-error">Error: { error }</p> }
            { editAbout?
              <textarea
                autoFocus
                value={about}
                className="edit-about-text"
                onChange={ (e) => setAbout(e.target.value) }
                onBlur={ () => {
                  toggleEditAbout(false);
                  saveAbout(about);
                } }
              />:
              (isAuthenticated && member._id === currentUser._id) ?
              <p className="about-text" onClick={ () => toggleEditAbout(true) }>
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
              <p className="about-text">
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
          </div>
        </div>
      </main>
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
