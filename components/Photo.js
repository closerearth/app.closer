import React from 'react';
import { cdn } from '../utils/api';

const sizes = {
  lg: '20',
  sm: '9'
}

const Photo = ({ id, size, title, cover, rounded, width, height, photoUrl }) => {
  const placeholder = '/images/profile-placeholder.png';
  const url = photoUrl ? photoUrl : id ? `${cdn}${id}-profile-${size}.jpg` : placeholder;
  const sizes = cover ? `w-${width || sizes[size]} h-${height || sizes[size]} `:''

  return (
    <span
      className={`${sizes} inline-flex justify-center items-center text-center ${rounded?'rounded-full overflow-hidden':''}`}
      title={ title }
    >
      { url && <img
        className={cover ? `relative z-10 object-contain w-full h-full` : ''}
        src={ url }
        alt={ title }
        title={ title }
      /> }
    </span>
  );
}

Photo.defaultProps = {
  size: 'sm',
  cover: true
};

export default Photo;
