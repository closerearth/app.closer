import axios from 'axios';
import config from '../config';

export const formatSearch = where => encodeURIComponent(JSON.stringify(where));
export const cdn = config.CDN_URL;

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'X-Platform': config.PLATFORM
  }
});

const staticCache = {};
const fetchStaticCache = async () => {
  try {
    const [resPartners, resSessions] = await Promise.all([
      api.get(`/airtables/rebuild/Partners`),
      api.get(`/airtables/rebuild/Sessions`)
    ]);

    staticCache.partners = resPartners.data;
    staticCache.sessions = resSessions.data;
    staticCache.lastFetch = Date.now();
    return staticCache;
  } catch (error) {
    console.log('Error fetching static cache', error.message);

    return {
      error
    };
  }
}
export const getStaticCache = async () => {
  if (staticCache.lastFetch < Date.now() - config.CACHE_DURATION) {
    return await fetchStaticCache();
  }
  return staticCache;
}

if (config.LOG_REQUESTS) {
  api.interceptors.request.use((req) => {
    console.log(req.method, req.url, req.params);
    return req;
  });
}

export default api;
