import React from "react";
import Photo from "./Photo";
import UploadPhoto from "./UploadPhoto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";



const EventPartners = ({event, user, togglePartnerForm, partnerForm, isAuthenticated, faTimes, addPartner, partnerToAdd, setPartnerToAdd, photo}) => {
    return (<div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-start w-full md:ml-full md:mr-full pb-12 pt-12 border-b border-black">
              <div className="flex flex-col w-full md:w-5/12">
                <h4 className="text-xl font-light">Partners</h4>
              </div>
             
              <div className="flex flex-col w-full md:w-7/12">
                <div className="flex flex-row flex-wrap w-full md:w-10/12">
                {event.partners && event.partners.map(partner => <a href={partner.url || "#"} target="_blank" rel="noreferrer" key={partner.name} className="mr-10 mb-7">
                          <Photo id={partner.photo} photoUrl={partner.photoUrl} className="w-full h-20" title={partner.name} />
                        </a>)}
                  </div>
                <button className="btn-primary h-fit self-start" onClick={() => togglePartnerForm(!partnerForm)}>Add Partner</button>
                {isAuthenticated && user._id === event.createdBy && partnerForm && <>
                 <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline">
                  <div className="relative w-11/12 my-6 mx-auto max-w-3xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col space-y-1 w-full bg-background outline-none focus:outline-none p-10">
                  <div className="flex flex-row items-center justify-between w-full">
                  <h3>Add partner</h3>
                  <FontAwesomeIcon icon={faTimes} className="hover:cursor-pointer" onClick={() => togglePartnerForm(!partnerForm)} />
                  </div>  
                  <form className="flex flex-col" onSubmit={e => addPartner(e, partnerToAdd)}>
                    <div className="flex flex-col w-full mt-5">
                      <label>Partner</label>
                      <input type="text" value={partnerToAdd.name} placeholder="Partner Name" onChange={e => setPartnerToAdd({ ...partnerToAdd,
                name: e.target.value
              })} />
                    </div>
                    <div className="flex flex-col mt-5 w-full">
                      <div className="flex flex-col items-center justify-start">
                        <label className="self-start">Logo</label>
                        {partnerToAdd.photo && <Photo id={partnerToAdd.photo} className="self-start" />}
                        <UploadPhoto onSave={photo => setPartnerToAdd({ ...partnerToAdd,
                  photo
                })} label="Upload logo" />
                      </div>
                        <button className="btn-primary mt-5">Add</button>
                    </div>
                  </form>
                </div>
                </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>}
              </div>
            </div>);
  }

  export default EventPartners;