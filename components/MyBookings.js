import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { usePlatform } from '../contexts/platform';
import BookingListPreview from './BookingListPreview';
import HomeModernIcon from './icons/HomeModernIcon';
import { __ } from '../utils/helpers';

const MyBookings = () => {
  const { user } = useAuth();
  const { platform } = usePlatform();
  const myBookingsFilter = user && { where: { createdBy: user._id, status: ['pending', 'confirmed', 'checkedIn'] } };

  const loadData = async () => {
    await Promise.all([
      platform.booking.get(myBookingsFilter)
    ]);
  }

  useEffect(() => {
    if (user && user._id){
      loadData();
    }
  }, [user]);

  const myBookings = platform.booking.find(myBookingsFilter);
  const noBookings = myBookings && myBookings.count() === 0;
  const error = myBookings && myBookings.get('error') // QUESTION: this Promise, how to get the error properly?

  if(error) {
    return <div className="validation-error">{ JSON.stringify(error) }</div>
  }

  if(!myBookings) {
    return null;
  }
  
  return (
    <div className="columns">
      <div className="col lg two-third">
        <div className="page-header">
          <h1 className="text-[32px] leading-[48px] font-normal border-b border-[#e1e1e1] border-solid pb-2 flex space-x-1 items-center">
            <HomeModernIcon width="32px" height="32px" />
            <span>
              { __('bookings_title') }
            </span>
          </h1>
        </div>
        <div className="bookings-list">
          { noBookings && <p className='mt-4'>{ __('no_bookings') }</p> }
          { myBookings.map(booking => <BookingListPreview key={ booking.get('_id') } booking={ booking } />) }
        </div>
      </div>
    </div>
  )
}

export default MyBookings