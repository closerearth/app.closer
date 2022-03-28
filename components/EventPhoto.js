import React from 'react';
import UploadPhoto from './UploadPhoto';

const EventPhoto = ({
  event,
  user,
  photo,
  cdn,
  isAuthenticated,
  id,
  setPhoto
}) => {
  return <div className="md:w-1/2 md:mr-4 mb-4 relative bg-gray-200 md:h-80">
    {photo ? <img className="object-cover md:h-full md:w-full" src={`${cdn}${photo}-max-lg.jpg`} alt={event.name} /> : event.visual && <img className="object-cover md:h-full md:w-full" src={event.visual} alt={event.name} />}
    {isAuthenticated && user._id === event.createdBy && <div className="absolute left-0 top-0 bottom-0 right-0 flex items-center justify-center opacity-0 hover:opacity-80">
      <UploadPhoto model="event" id={event._id} onSave={id => setPhoto(id)} label={photo ? 'Change photo' : 'Add photo'} />
    </div>}
  </div>;
}
export default EventPhoto;
