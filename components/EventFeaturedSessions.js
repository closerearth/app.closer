import React from "react";


const EventFeaturedSessions= () => {
    return (<div className="flex flex-col space-y-4 md:space-y-0 md:flex-row items-start justify-start w-full md:ml-full md:mr-full pb-12 pt-12 border-b border-black">
              <div className="flex flex-col w-full md:w-5/12">
                <h4 className="text-xl font-light">Featured Sessions</h4>
              </div>
              <div className="flex flex-col md:flex-row w-full md:w-7/12">
                <div className="flex flex-row items-start justify-start w-full md:w-1/2">
                 <div className="flex flex-col w-full ">
                  <img src="/images/sea.jpg" alt="avatar" className="flex w-full md:w-11/12 h-auto" />
                  <div className="flex flex-row items-center justify-start mt-4">
                   <img src="/images/icons/avatar.jpg" alt="avatar" className="w-10" />
                   <p className="font-semibold">Speaker Name</p>
                  </div>
                 </div>
                </div>
                <div className="flex flex-col w-full mt-5 md:mt-0 md:w-1/2 space-y-1 items-start justify-start">
                    <h3 className="font-semibold text-lg">Lorem ipsum dolr sit amet? labore dolore magna 2022</h3>
                    <p className="flex w-full text-lg"> Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. 
                      </p>
                    <p className="text-sm font-semibold">Mar 1, 2022 - 14h</p>
                    <p className="text-sm font-semibold">Online</p>
                  </div>

              </div>
            </div>);
  }

  export default EventFeaturedSessions;