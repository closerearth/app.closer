import React from "react";

const EventAbout = ({event}) => {
    return (<div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-start w-full md:ml-full md:mr-full pb-12 pt-12 border-b border-black">
              <div className="flex flex-col  w-full md:w-5/12">
                <h4 className="text-xl font-light">About this edition</h4>
              </div>
              <div className="flex flex-col w-full md:w-7/12">
                <p className="w-full md:w-10/12">{event.description}</p>
              </div>
            </div>);
  }

export default EventAbout;