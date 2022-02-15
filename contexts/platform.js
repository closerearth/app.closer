import React, { createContext, useState, useContext, useEffect, useReducer } from 'react';
import { Map, fromJS } from 'immutable';

import api, { formatSearch } from '../utils/api';
import * as constants from '../constants';
import config from '../config';

const PlatformContext = createContext({});
export const models = [
  'user',
  'post',
  'photo',
  'message',
  'event',
  'application',
  'listing',
  'booking',
  'ticket',
  'nest'
];
const idList = entry => Array.from(new Set((
  typeof entry === 'string' ?
    entry.split(',') :
    Iterable.isIterable(entry) ?
      entry.toJS() :
      entry instanceof Array ?
        entry :
        []
)));
const filterToKey = filter => JSON.stringify(filter) || '__';
const init = (state) => {
  return state.withMutations(map => {
    models.forEach(model => {
      map.set(model, Map({
        byId: Map(),
        byFilter: Map()
      }));
    })
  });
}
const initialState = init(Map());

const reducer = (state, action) => {
  switch (action.type) {
    case constants.GET_ONE_INIT:
      return state.setIn([action.model, 'byId', action.id, 'loading'], true);
    case constants.GET_ONE_ERROR:
      return state
        .mergeIn([action.model, 'byId', action.id], Map({
          error: action.error,
          loading: false
        }));
    case constants.GET_ONE_SUCCESS:
      return state
        .mergeIn([action.model, 'byId', action.id], Map({
          data: action.results,
          loading: false,
          error: null,
          receivedAt: Date.now()
        }));
    case constants.POST_INIT:
      return state
        .set([action.model, 'isPosting'], true);
    case constants.PATCH_INIT:
      return state
        map.setIn([action.model, 'byId', action._id, 'loading'], true);
    case constants.PATCH_ERROR:
      return state
        map.mergeIn([action.model, 'byId', action._id], Map({
          loading: false,
          error: action.error
        }));
    case constants.POST_ERROR:
      return state
        .set([action.model, 'isPosting'], false)
        .set([action.model, 'postError'], action.error);
    case constants.POST_SUCCESS:
      return state
        .set([action.model, 'isPosting'], false)
        .mergeIn([action.model, 'byId', action.id], Map({
          data: action.results,
          loading: false,
          error: null,
          receivedAt: Date.now()
        }));
    case constants.PATCH_SUCCESS:
      return state
        .setIn([action.model, 'byId', action._id], Map({
          data: action.results,
          loading: false,
          error: null,
          receivedAt: Date.now()
        }));
    case constants.GET_INIT:
      return state.setIn([action.model, 'byFilter', action.filterKey, 'loading'], true);
    case constants.GET_ERROR:
      return state
        .mergeIn([action.model, 'byFilter', action.filterKey], Map({
          error: action.error,
          loading: false
        }));
    case constants.GET_SUCCESS:
      return state.withMutations(map => {
          map.setIn([action.model, 'byFilter', action.filterKey], Map({
            data: action.results,
            loading: false,
            error: null,
            receivedAt: action.receivedAt
          }));
          if (action.results) {
            action.results.forEach((item) => {
              if (item.get('_id')) {
                map.setIn([action.model, 'byId', item.get('_id')], Map({
                  data: item,
                  loading: false,
                  error: null,
                  receivedAt: action.receivedAt
                }))
              }
            });
          } else {
            console.log('no results', action);
          }

          return map;
        });
    case constants.GET_COUNT_INIT:
      return state.setIn([action.model, 'count', action.filterKey, 'loading'], true);
    case constants.GET_COUNT_ERROR:
      return state
        .mergeIn([action.model, 'count', action.filterKey], Map({
          error: action.error,
          loading: false
        }));
    case constants.GET_COUNT_SUCCESS:
      return state.setIn(
        [action.model, 'count', action.filterKey],
        Map({
          data: action.results,
          loading: false,
          error: null,
          receivedAt: Date.now()
        })
      );
    default:
      console.log('Unknown action type', action.type);
      return null;
  }
}
export const PlatformProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const platform = {
    toJS: () => state.toJS()
  };
  if (config.EXPOSE_STORE && typeof window !== 'undefined') {
    window.platform = platform;
  }
  models.forEach(model => {
    platform[model] = {
      // Find data in the state
      find: filter => state.getIn([model, 'byFilter', filterToKey(filter), 'data']),
      findOne: id => state.getIn([model, 'byId'].concat(id, 'data')),
      findGraph: filter => state.getIn([model, 'byGraph', filterToKey(filter), 'data']),
      findCount: filter => state.getIn([model, 'count', filterToKey(filter), 'data']),

      isLoading: id => state.getIn([model, 'byId', id, 'loading']),
      areLoading: filter => state.getIn([model, 'byFilter', filterToKey(filter), 'loading']),

      // Manually store an object in the store
      set: (object) => {
        const results = fromJS(object);
        const action = {
          results,
          receivedAt: Date.now(),
          id: results.get('_id'),
          model,
          type: constants.GET_ONE_SUCCESS
        };
        dispatch(action);
      },
      // Loaders
      getOne: (id, opts = {}) => {
        dispatch({ type: constants.GET_ONE_INIT, model, id });
        if (
          state.getIn([model, 'byId', id, 'receivedAt']) > Date.now() - config.CACHE_DURATION
        ) {
          return new Promise(resolve => resolve({
            type: constants.GET_ONE_SUCCESS,
            fromCache: true,
            results: state.getIn([model, 'byId', id])
          }));
        }
        return (
          api.get(`/${model}/${id}`)
            .then(res => {
              const results = fromJS(res.data.results);
              if (opts.fetchLinkedObjects && results.count()) {
                platform.user.get({ _id: { $in: results.map(item => model === 'user' ? item.get('_id') : item.get('createdBy')) } })
              }
              const action = { results, id, model, type: constants.GET_ONE_SUCCESS };
              dispatch(action);
              return action;
            })
            // .then(fetchLinkedObjects(api)((Object.assign({ id, model }, opts))))
            .catch(error => dispatch({ error, id, model, type: constants.GET_ONE_ERROR }))
        );
      },
      get: (filter, opts = {}) => {
        const options = Object.assign({ sort_by: '-created' }, filter);
        const filterKey = filterToKey(filter);
        if (
          state.getIn([model, 'byFilter', filterKey, 'receivedAt']) > Date.now() - config.CACHE_DURATION
        ) {
          return new Promise(resolve => resolve({
            filterKey,
            type: constants.GET_SUCCESS,
            fromCache: true,
            receivedAt: state.getIn([model, 'byFilter', filterKey, 'receivedAt']),
            results: state.getIn([model, 'byFilter', filterKey, 'data'])
          }));
        }

        dispatch({ type: constants.GET_INIT, model, filterKey });
        // ids_loading[model] = ids_loading[model].concat(id);
        return (
          api.get(`/${model}`, { params: {
            ...options,
            where: options.where && formatSearch(options.where)
          }})
            .then(res => {
              const action = {
                results: fromJS(res.data.results),
                receivedAt: Date.now(),
                filterKey,
                model,
                type: constants.GET_SUCCESS
              };
              dispatch(action);
              return action;
            })
            .catch(error => dispatch({ error, filterKey, model, type: constants.GET_ERROR }))
        );
      },
      getCount: (params, opts = {}) => {
        const filterKey = filterToKey(params);
        // if (params && params.where) {
        //   params.where = formatSearch(params.where);
        // }
        dispatch({ type: constants.GET_COUNT_INIT, model, filterKey });
        if (
          state.getIn([model, 'count', filterKey, 'receivedAt']) > Date.now() - config.CACHE_DURATION
        ) {
          return new Promise(resolve => resolve({
            type: constants.GET_COUNT_SUCCESS,
            fromCache: true,
            results: state.getIn([model, 'count', filterKey, 'data'])
          }));
        }
        return (
          api.get(`/count/${model}`, { params })
            .then(res => {
              const results = fromJS(res.data.results);
              const action = { results, filterKey, model, type: constants.GET_COUNT_SUCCESS };
              dispatch(action);
              return action;
            })
            .catch(error => dispatch({ error, filterKey, model, type: constants.GET_COUNT_ERROR }))
        );
      },
      post: (data, opts = {}) => {
        const filterKey = filterToKey(data);
        dispatch({ type: constants.POST_INIT, model, filterKey });
        return (
          api.post(`/${model}`, data)
            .then(res => {
              const results = fromJS(res.data.results);
              const action = { results, id: results.get('_id'), filterKey, model, type: constants.POST_SUCCESS };
              dispatch(action);
              return action;
            })
            .catch(error => dispatch({ error, data, filterKey, model, type: constants.POST_ERROR }))
        );
      },
      patch: (_id, data, opts = {}) => {
        dispatch({ type: constants.PATCH_INIT, model, _id, data });
        return (
          api.patch(`/${model}/${_id}`, data)
            .then(res => {
              const results = fromJS(res.data.results);
              const action = { results, _id, data, model, type: constants.PATCH_SUCCESS };
              dispatch(action);
              return action;
            })
            .catch(error => dispatch({ error, _id, data, model, type: constants.PATCH_ERROR }))
        );
      },
    };
  });

  return (
    <PlatformContext.Provider
      value={{ platform }}
    >
      { children }
    </PlatformContext.Provider>
  )
}

export const usePlatform = () => useContext(PlatformContext);
