import React from 'react';
import Photo from './Photo';
import UploadPhoto from './UploadPhoto';

const EventPartners = ({ event, user, isAuthenticated, partnerToAdd }) => {
  return (<section className="mb-6">
    <div className="flex flex-row flex-wrap justify-center items-center">
      {event.partners && event.partners.map(partner => partner.photoUrl && <a href={partner.url || '#'} target="_blank" rel="noreferrer" key={partner.name} className="mr-3">
        <Photo id={partner.photo} photoUrl={partner.photoUrl} className="w-32 h-16" title={partner.name} />
      </a>)}
    </div>
    { (isAuthenticated && user._id === event.createdBy) &&
     <div className="m-4">
       <h3>Add partner</h3>
       <form className="flex flex-row p-2" onSubmit={ e => addPartner(e, partnerToAdd) }>
         <div className="w-2/3">
           <input
             type="text"
             value={ partnerToAdd.name }
             placeholder="Partner Name"
             onChange={ e => setPartnerToAdd({ ...partnerToAdd, name: e.target.value }) }
           />
         </div>
         <div className="w-1/3">
           { partnerToAdd.photo && <Photo id={ partnerToAdd.photo } /> }
           <div className="flex flex-row``">
             <UploadPhoto
               onSave={ photo => setPartnerToAdd({ ...partnerToAdd, photo }) }
               label="Upload logo"
             />
             <button className="btn-primary">Add</button>
           </div>
         </div>
       </form>
     </div>
    } 
    
  </section>);
}
  
export default EventPartners;
  