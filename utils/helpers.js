import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

const ONE_HOUR = 60 * 60 * 1000;

export const getHashTags = (inputText) => {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;

    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    return matches;
}

const urlsRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
export const getUrls = text =>
  Array.from(new Set((text || '').match(urlsRegex)))
  .map(url => {
    if (!/^https?:\/\//i.test(url)) {
      return 'http://' + url;
    }
    return url;
  });

export const getTimeDetails = (eventTime) => {
  // '2021-05-1 19:59:59' | '2021-05-1 18:59:59'
  if (!eventTime) {
    throw new Error('Missing eventTime');
  }
  const now = dayjs();
  const oneHourAgo = dayjs(new Date() - ONE_HOUR);
  if (eventTime.isBefore(now) && eventTime.isAfter(oneHourAgo)) {
    return {
      class: 'now',
      label: 'HAPPENING NOW',
      longLabel: 'Session is in progress!',
    };
  } else if (
    eventTime.isBefore(now.add(7, 'minutes')) &&
    eventTime.isAfter(oneHourAgo)
  ) {
    return {
      class: 'soon',
      label: 'HAPPENING SOON',
      longLabel: 'Starting soon!',
    };
  } else if (eventTime.isBefore(oneHourAgo)) {
    return {
      class: 'past',
      longLabel: `The session took place ${eventTime.from(now)}`,
      label: eventTime.fromNow(), //eventTime.from(now)
    };
  }
  return {
    class: 'future',
    longLabel: `Happening ${eventTime.from(now)}`,
    label: eventTime.fromNow(), //eventTime.from(now)
  };
};

export const priceFormat = (price, currency = 'EUR') => parseFloat(price).toLocaleString('en-US', {style: 'currency', currency});
