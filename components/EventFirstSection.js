import React from 'react';
import Link from 'next/link';
import UploadPhoto from './UploadPhoto'

const EventMainImage = ({
  photo,
  event,
  cdn,
  isAuthenticated,
  user,
  setPhoto,
}) => {
  return (
    <div className="w-full mb-4 relative bg-gray-200 h-[450px]">
      {photo && (
        <img
          className="object-cover h-full w-full"
          src={`${cdn}${photo}-max-lg.jpg`}
          alt={event.name}
        />
      )}
      {isAuthenticated && user._id === event.createdBy && (
        <div className="absolute top-50 bottom-5 right-5 flex items-center justify-center hover:opacity-80">
          <UploadPhoto
            model="event"
            id={event._id}
            onSave={(id) => setPhoto(id)}
            label={photo ? 'Change photo' : 'Add photo'}
          />
        </div>
      )}
      <h2 className="absolute inset-0 top-1/3 ml-auto mr-auto w-max text-background text-6xl">
        {event.name}
      </h2>
      <Link href={'/events'}>
        <p className="absolute top-5 bottom-50 left-5 text-lg cursor-pointer text-background">
          {'< All Events'}
        </p>
      </Link>
    </div>
  );
};

export default EventMainImage;
