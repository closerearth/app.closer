import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { __ } from '../utils/helpers';
import { TiDelete } from '@react-icons/all-files/ti/TiDelete'
import { TiEdit } from '@react-icons/all-files/ti/TiEdit'
import { TiHeartFullOutline } from '@react-icons/all-files/ti/TiHeartFullOutline'
import { TiHeartOutline } from '@react-icons/all-files/ti/TiHeartOutline'
import { format, parseISO } from 'date-fns'
import { useAuth } from '../contexts/auth';
import { usePlatform } from '../contexts/platform';

const SessionListPreview = ({ session }) => {

  const { user: currentUser, isAuthenticated } = useAuth();
  const { platform } = usePlatform();
  const start = parseISO( session.get('start') )
  const end = parseISO( session.get('end') )  
  const [liked, setLiked] = useState(false);
  const [likedBy, setLikedBy] = useState(session && (session.get('likedBy') || []));


  const likePost = async () => {
    setLiked(!liked)
    try {
      if (!liked) {
        const { data } = await platform.session.patch( session.get('_id'),  { likedBy: (likedBy || []).concat(currentUser.screenname) })
        setLikedBy(data.likedBy) 
      }
      else {
        const { data } = await platform.session.patch( session.get('_id'),  { likedBy: likedBy.filter((item) => item !== currentUser.screenname ) })
        setLikedBy(data.likedBy) 
      }
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    setLikedBy(likedBy)
  }, [session])

  if (!session) {
    return null;
  }


  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <div className="flex-auto">
        <h4 className="text-gray-900">{session.get('name')}</h4>
        <p className="text-gray-900 text-lg">{session.get('speakers')}</p>
        <p className="text-gray-900">{session.get('description')}</p>
        <p className="text-gray-400 text-base">{session.get('category')}</p>
        <p className="mt-0.5 text-gray-400 text-base">
          <time>
            {format(start, 'MMMM do h:mm a')}
          </time>{' '}
          -{' '}
          <time>
            {format(end, 'h:mm a')}
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
            <TiHeartOutline className="h-5 group-hover:text-gray-500 text-lg hover:cursor-pointer hidden group-hover:block" />
          )}
        </div>
        { likedBy && (
          <span
            className={`group-hover:text-pink-600 text-xs hidden group-hover:block ${
              liked && 'text-pink-600'
            }`}
          >
            {Object.keys(likedBy).length}
          </span>
        )}
      </div>
      <Link as={`/sessions/${session.get('slug')}/edit`} href={`sessions/${session.get('slug')}/edit`}>
        <a >
          <TiEdit className='text-gray-500 text-lg hover:text-black hover:cursor-pointer hidden group-hover:block' />
        </a>
      </Link>
    </li>
  )
}

export default SessionListPreview;