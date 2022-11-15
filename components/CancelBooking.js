import { priceFormat, __, calculateRefundTotal } from '../utils/helpers';
import { useState } from 'react'
import api from '../utils/api';
import Spinner from './Spinner';
import CalculatorIcon from './icons/CalculatorIcon';

const CancelBooking = ({ setCancelCompleted, bookingId, initialBookingValue, bookingStartDate, isMember, isPolicyLoading, policy }) => {
  const [error, setError] = useState(null)
  const [isSendingCancelRequest, setSendingCancelRequest] = useState(false)

  const cancelBooking = () => {
    try {
      setSendingCancelRequest(true)
      api.post(`/bookings/${bookingId}/cancel`);
      setCancelCompleted(true)
    } catch (err) {
      console.error('Error', err.message);
      setError(err.message)
    } finally {
      setSendingCancelRequest(false)
    }
  }

  const backToBookings = () => {
    router.push('/bookings')
  }
  
  return (
    <main className="main-content max-w-prose pb-16">
      <h1 className="text-[32px] leading-[48px] font-normal border-b border-[#e1e1e1] border-solid pb-2">
        <span className="text-red-500">!? </span><span>{ __('cancel_booking_title') }</span>
      </h1>
      <h2 className="text-2xl leading-10 font-normal my-16">
        { __('cancel_booking_details') }
      </h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <h2 className="text-2xl leading-10 font-normal my-16">
        { __('cancel_booking_refund_policy') }
      </h2>
      <p>
        {isMember ?__('booking_cancelation_policy_member') : __('booking_cancelation_policy')}
      </p>
      <h2 className="text-2xl leading-10 font-normal mt-16 mb-3 border-b border-[#e1e1e1] border-solid pb-2 flex space-x-1 items-center">
        <CalculatorIcon />
        <p>
          { __('cancel_booking_refund_total') }
        </p>
      </h2>
      <div className="flex justify-between mb-16">
        <p>{ __('cancel_booking_fiat_description') }</p>
        {(isPolicyLoading || !policy) ? <Spinner /> : <p className="font-black">{priceFormat(calculateRefundTotal({ initialValue: initialBookingValue, policy: policy.results, startDate: bookingStartDate }))}</p>}
      </div>
      { error && <p className="text-red-500 m-2 text-center">{error}</p> }
      <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-4 md:justify-end">
        <button className="btn items-center" onClick={cancelBooking}>
          {isSendingCancelRequest ? <Spinner className="w-fit mx-auto h-[24px] -top-1 relative" /> : __('generic_yes').toUpperCase() }
        </button>
        <button className="btn" onClick={backToBookings}>
          { __('generic_no').toUpperCase() }
        </button>
      </div>
    </main>
  )
}

export default CancelBooking