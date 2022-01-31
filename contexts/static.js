import React, { createContext, useState, useContext, useEffect } from 'react'
import dayjs from 'dayjs';
import PageNotAllowed from '../pages/401';

import api from '../utils/api';
import { streams } from '../utils/const';
import config from '../config';
const ONE_HOUR = 60 * 60 * 1000;

const StaticContext = createContext({});

export const computeSchedule = sessions => {
  const map = {};

  sessions.forEach(session => {
    const date = dayjs(session.date);
    const day = date.format('ddd');
    const time = date.format('HH')
    if (!map[day]) {
      map[day] = {};
    }
    if (!map[day][time]) {
      map[day][time] = [];
    }
    map[day][time].push(session);
  })

  return map;
}

export const StaticProvider = ({ children }) => {

  const [cache, setCache] = useState({});
  const [lastFetch, setLastFetch] = useState(null);
  const [staticLoadError, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getStaticCache();
    const refreshInterval = setInterval(getStaticCache, 60000);
    return () => clearInterval(refreshInterval);
  }, []);

  const getStaticCache = async () => {
    if (lastFetch < Date.now() - config.CACHE_DURATION) {
      return await getStaticContent();
    }
    return cache;
  }

  const getStaticContent = async (signup_token, password, onSuccess) => {
    try {
      const [{ data: partners }, { data: rawSessions }, { data: salon }] = await Promise.all([
        api.get(`/airtables/rebuild/Partners`),
        api.get(`/airtables/rebuild/Sessions`),
        api.get(`/airtables/rebuild/Salon`),
      ]);

      const now = new Date(); //'2021-05-1 19:59:59'
      const sessions = rawSessions
        .map(ses => {
          ses.title = ses.title.replace('⭐', '');
          ses.streamSlot = streams.findIndex(stream => stream.name === ses.stream);
          return ses;
        })
        .sort((a, b) => a.streamSlot - b.streamSlot)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const futureSessions = sessions
        .filter(ses => dayjs(ses.date).isAfter(dayjs(now.getTime() - ONE_HOUR)))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const happeningSoon = sessions
        .filter(ses => (
          dayjs(ses.date).isAfter(now) &&
          dayjs(ses.date).isBefore(dayjs(now.getTime() + ONE_HOUR))
        ))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const happeningNow = sessions
        .filter(ses => (
          dayjs(ses.date).isAfter(dayjs(now.getTime() - ONE_HOUR)) &&
          dayjs(ses.date).isBefore(now)
        ))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const pastSessions = sessions
        .filter(ses => dayjs(ses.date).isBefore(dayjs(now.getTime() - ONE_HOUR)))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const schedule = computeSchedule(sessions);

      const newCache = {
        sessions,
        salon,
        partners,
        schedule,
        happeningSoon,
        happeningNow,
        futureSessions,
        pastSessions
      };
      setCache(newCache);

      return newCache;
    } catch (err) {
      const error = err.response?.data?.error || err.message;
      console.log('Error loading cache:', error);
      setError(error);
    }
  }

  return (
    <StaticContext.Provider
      value={{
        cache,
        getStaticCache,
        staticLoadError
      }}
    >
      { children }
    </StaticContext.Provider>
  )
}

export const useStatic = () => useContext(StaticContext)
