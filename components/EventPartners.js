import React, { useState } from 'react';
import Photo from './Photo';
import UploadPhoto from './UploadPhoto';
import { FaTimes } from '@react-icons/all-files/fa/FaTimes';
import { __ } from '../utils/helpers';

const EventPartners = ({ event, user, isAuthenticated, addPartner, partnerToAdd, setPartnerToAdd, partnerForm, togglePartnerForm }) => {


  return (<section className="mb-6">
    <div className="flex flex-row flex-wrap justify-center items-center">
      {event.partners && event.partners.map(partner => partner.photo && <a href={partner.url || '#'} target="_blank" rel="noreferrer" key={partner.name} className="mr-3">
        <Photo id={partner.photo} photoUrl={partner.photoUrl} className="w-32 h-16" title={partner.name} />
      </a>)}
    </div>
    <button className="btn-primary h-fit self-start" onClick={() => togglePartnerForm(!partnerForm)}>Add Partner</button>
    { (isAuthenticated && user._id === event.createdBy && partnerForm) &&
      <>
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline">
          <div className="relative w-11/12 my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col space-y-1 w-full bg-background outline-none focus:outline-none p-10">
              <div className="flex items-center justify-center w-full">
                <h3 className="text-xl font-normal mb-3">Add partner</h3>
              </div>  
              <form className="flex flex-col" onSubmit={ e => addPartner(e, partnerToAdd) }>
                <div className="flex flex-col w-full mt-5">
                  <label>Partner</label>
                  <input
                    type="text"
                    value={ partnerToAdd.name }
                    placeholder="Partner Name"
                    onChange={ e => setPartnerToAdd({ ...partnerToAdd, name: e.target.value }) }
                  />
                </div>
                <div className="flex flex-col mt-5 w-full">
                  <div className="flex flex-col items-center justify-start">
                    <label className="self-start">Logo</label>
                    { partnerToAdd.photo && <Photo id={ partnerToAdd.photo } className="self-start" /> }
                    <div className='self-start mb-8 mt-2'>
                      <UploadPhoto
                        onSave={ photo => setPartnerToAdd({ ...partnerToAdd, photo }) }
                        label="Upload logo"
                      />
                    </div>
                  </div>
                  <div className='flex flex-row items-center justify-start'>
                    <button type='submit' className='btn-primary w-24 mr-6'>Add</button>
                    <a
                      href="#"
                      onClick={ (e) => {
                        e.preventDefault();
                        togglePartnerForm(!partnerForm);
                      }}
                    >
                    Cancel
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    }
    
  </section>);
}
  
export default EventPartners;
  