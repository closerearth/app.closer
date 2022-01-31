import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { formatSearch, cdn } from '../utils/api';

import UploadPhoto from './UploadPhoto';

import { useAuth } from '../contexts/auth.js';

const Prompts = () => {

  const { user, isAuthenticated, setUser } = useAuth();
  const [error, setErrors] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [photo, setPhoto] = useState(null);

  if (!isAuthenticated) {
    return null;
  }

  const image = (photo || user.photo);

  if (!user?.photo && !isClosed) {
    return (
      <div className="main-content">
        <section className="prompts-overlay">
          <div className="prompt-text">
            { image ?
              <p>Looking good {user.screenname} ♥️</p>:
              <p>It's nice to have you here {user.screenname}. Now let's add a photo to your profile ♥️</p>
            }
            <p>
              <a
                href="#"
                onClick={ e => {
                  e.preventDefault();
                  setIsClosed(true);
                } }
              >
                Close this
              </a>
            </p>
          </div>
          <div
            className={`profile-photo xl ${image?'has-image':'placeholder'}`}
            style={ { backgroundImage: image && `url("${cdn}${image}-max-lg.jpg")` } }
          >
            <UploadPhoto
              model="user"
              id={user._id}
              onSave={id => {
                setPhoto(id);
                setTimeout(() => setUser({ ...user, photo: id }), 4000);
              }}
              label={ image ? 'Change photo': 'Add photo' }
            />
          </div>
        </section>
      </div>
    );
  }
  return null;
};

export default Prompts;
