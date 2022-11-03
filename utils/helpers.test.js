import { calculateRefundTotal } from './helpers';

const POLICY_MOCK = {
  default: 1,
  lastmonth: 0.5,
  lastweek: 0.25,
  lastday: 0.01
}

const BOOKING_MOCK = {
  'status': 'confirmed',
  'listing': '622c20352162bf4fa42049e0',
  'start': '2022-12-28T18:00:00.000Z',
  'end': '2022-12-30T11:00:00.000Z',
  'duration': 2,
  'price': {
    'val': 600,
    'cur': 'USD'
  },
  'visibility': 'public',
  'visibleBy': [],
  'createdBy': '6356e38db2fcc15ff6cee29a',
  'updated': '2022-11-03T19:13:10.385Z',
  'created': '2022-11-03T19:13:03.747Z',
  'attributes': [],
  'managedBy': [],
  '_id': '636412bfa1dd196ed960e6d0'
}
const initialBookingValue = BOOKING_MOCK.price.val;

describe('calculateRefundTotal', () => {
  it('should return initialValue * defaultRefund if start date > 30 days ', () => {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 31);
    targetDate.setHours(targetDate.getHours() + 1);
    const booking = {
      ...BOOKING_MOCK,
      start: targetDate
    }
    const refundTotal = calculateRefundTotal(booking, POLICY_MOCK);
    expect(refundTotal).toBe(initialBookingValue * POLICY_MOCK.default);
  });

  it('should return initialValue * lastmonth if start date > 7 days ', () => {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(targetDate.getHours() + 1);
    const booking = {
      ...BOOKING_MOCK,
      start: targetDate
    }
    const refundTotal = calculateRefundTotal(booking, POLICY_MOCK);
    expect(refundTotal).toBe(initialBookingValue * POLICY_MOCK.lastmonth);
  });

  it('should return initialValue * lastweek if start date > 3 day ', () => {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(targetDate.getHours() + 1);
    const booking = {
      ...BOOKING_MOCK,
      start: targetDate
    }
    const refundTotal = calculateRefundTotal(booking, POLICY_MOCK);
    expect(refundTotal).toBe(initialBookingValue * POLICY_MOCK.lastweek);
  });

  it('should return initialValue * lastday if start date > 1 day ', () => {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(targetDate.getHours() + 1);
    const booking = {
      ...BOOKING_MOCK,
      start: targetDate
    }
    const refundTotal = calculateRefundTotal(booking, POLICY_MOCK);
    expect(refundTotal).toBe(initialBookingValue * POLICY_MOCK.lastday);
  });

  it('should return 0 if start date is in the past or equal to now', () => {
    let targetDate = new Date();
    const booking = {
      ...BOOKING_MOCK,
      start: targetDate
    }
    const refundTotal = calculateRefundTotal(booking, POLICY_MOCK);
    expect(refundTotal).toBe(0);
  });

  it('should return 0 if a guest is volunteering', () => {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);
    targetDate.setHours(targetDate.getHours() + 1);
    const booking = {
      ...BOOKING_MOCK,
      start: targetDate,
      volunteer: true
    }
    const refundTotal = calculateRefundTotal(booking, POLICY_MOCK);
    expect(refundTotal).toBe(0);
  })
});

