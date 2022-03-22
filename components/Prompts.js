import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { formatSearch, cdn } from '../utils/api';

import UploadPhoto from './UploadPhoto';

import { useAuth } from '../contexts/auth.js';
import polyglot from '../locales/base';

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
      <div>
        <div className="main-content p-3 justify-between flex flex-col relative text-center shadow-sm">
          <div className="p-2">
            { image ?
              <p>{ polyglot.t('image_true', { name: user.screenname }) }</p>:
              <p>{ polyglot.t('image_false', { name: user.screename })  }</p>
            }
          </div>
          <div className="flex flex-row justify-center items-center">
            <div>
              { image && <img
                src={`${cdn}${image}-max-lg.jpg`}
                alt={ user.screenname }
                className="w-16 h-16 rounded-full"
              /> }
            </div>
            <div className="ml-4">
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
          </div>
          <div className="absolute top-0 right-0 p-4">
            <a
              href="#"
              onClick={ e => {
                e.preventDefault();
                setIsClosed(true);
              } }
            >
              Close this
            </a>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default Prompts;
