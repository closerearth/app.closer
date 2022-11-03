import { priceFormat, __, calculateRefundTotal } from '../utils/helpers'
import { useState } from 'react'
import Link from 'next/link'
import api from '../utils/api';
import Spinner from './Spinner';
import CalculatorIcon from './icons/CalculatorIcon';
import dayjs from 'dayjs';

const CancelBooking = ({ setCancelCompleted, bookingId, booking, isMember, isPolicyLoading, policy }) => {
  const [error, setError] = useState(null)
  const [isSendingCancelRequest, setSendingCancelRequest] = useState(false)

  if (!booking || !policy) {
    return null
  }

  const refundTotal = calculateRefundTotal(booking, policy)
  const start = dayjs(booking.start);
  const end = dayjs(booking.end);

  const cancelBooking = () => {
    try {
      setSendingCancelRequest(true)
      api.post(`/bookings/${bookingId}/cancel`)
      setCancelCompleted(true)
    } catch (err) {
      console.error('Error', err.message)
      setError(err.message)
    } finally {
      setSendingCancelRequest(false)
    }
  }

  return (
    <main className="main-content max-w-prose pb-16">
      <h1 className="text-[32px] leading-[48px] font-normal border-b border-[#e1e1e1] border-solid pb-2">
        <span className="text-red-500">!? </span>
        <span>{__('cancel_booking_title')}</span>
      </h1>
      <h2 className="text-2xl leading-10 font-normal my-16">
        { __('cancel_booking_details') }
      </h2>
      <p>{ __('bookings_status') } <b>{booking.status}</b></p>
      <p>{ __('bookings_checkin') } <b>{start.format('LLL')}</b></p>
      <p>{ __('bookings_checkout') } <b>{end.format('LLL')}</b></p>
      <p>{ __('bookings_total') } 
        <b className={ booking.volunteer ? 'line-through': '' }>
          {' '}{priceFormat(booking.price)}
        </b>
        <b>{' '}{booking.volunteer && priceFormat(0, booking.price.cur)}</b>
      </p>
      <h2 className="text-2xl leading-10 font-normal my-16">
        { __('cancel_booking_refund_policy') }
      </h2>
      <p>
        {isMember ?__('booking_cancelation_policy_member') : __('booking_cancelation_policy')}
      </p>
      <h2 className="text-2xl leading-10 font-normal my-16">{__('cancel_booking_refund_policy')}</h2>
      <p>{isMember ? __('booking_cancelation_policy_member') : __('booking_cancelation_policy')}</p>
      <h2 className="text-2xl leading-10 font-normal mt-16 mb-3 border-b border-[#e1e1e1] border-solid pb-2 flex space-x-1 items-center">
        <CalculatorIcon />
        <p>{__('cancel_booking_refund_total')}</p>
      </h2>
      <div className="flex justify-between mb-16">
        <p>{ __('cancel_booking_fiat_description') }</p>
        {(isPolicyLoading) ? <Spinner /> : <p className="font-black">{priceFormat(refundTotal, booking.price.cur)}</p>}
      </div>
      {error && <p className="text-red-500 m-2 text-center">{error}</p>}
      <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-4 md:justify-end">
        <button className="btn-primary items-center" onClick={cancelBooking}>
          {isSendingCancelRequest ? (
            <Spinner className="w-fit mx-auto h-[24px] -top-1 relative" />
          ) : (
            __('confirm_cancel')
          )}
        </button>
        <Link href="/bookings" passHref>
          <a className="btn text-center"> 
            {__('back_to_my_bookings')}
          </a>
        </Link>
      </div>
    </main>
  )
}

export default CancelBooking
