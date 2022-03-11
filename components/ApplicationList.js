import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import models from '../models';
import { usePlatform } from '../contexts/platform';
import { useAuth } from '../contexts/auth';
import api from '../utils/api';
import TimeSince from './TimeSince';
import Pagination from './Pagination';


const ApplicationList = ({ children, channel, status, managedBy, limit }) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [page, setPage] = useState(1);
  const [applicationMeta, setApplicationMeta] = useState({});
  const [error, setErrors] = useState(false);
  const router = useRouter();
  const filter = useMemo(() => ({
    where: { status },
    limit,
    page
  }), [status, limit, page]);
  if (managedBy) {
    filter.where.managedBy = { $in: [managedBy] };
  }
  const applications = platform.application.find(filter);

  const updateApplication = async (id, status, app={}) => {
    try {
      await platform.application.patch(id, { ...app, status });
    } catch (err) {
      console.log('Failed to approve application', err);
      setErrors(err.message)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        platform.application.getCount(filter);
        platform.application.get(filter);
      } catch (err) {
        console.log('Load error', err);
        setErrors(err.message)
      }
    })();
  }, [platform, filter]);

  return (
    <div className="application-list">
      { applications && applications.count() > 0 ?
        applications.map(app => {
          const application = platform.application.findOne(app.get('_id'));

          return (
            <div key={ application.get('_id') } className="application-preview card">
              <div className="card-title">
                <h3>{ application.get('name') }</h3>
                <div>
                  <TimeSince time={ application.get('created') } />
                  {' '}
                  <span className="tag">{application.get('status')}</span>
                </div>
              </div>
              <div className="card-body">
                { models.application.map(({ label, name, status }) => (
                  <div key={ name } className="mb-2">
                    <p>
                      <i className="text-gray-500">{label}</i><br />
                      {application.get(name)}
                    </p>
                  </div>
                )) }
                { application.fields && Object.keys(application.fields).map((field) => (
                  <div key={ field } className="mb-2">
                    <p>
                      <i className="text-gray-500">{ field }</i><br />
                      {application.get(field)}
                    </p>
                  </div>
                )) }
              </div>
              { application.get('status') === 'conversation' &&
                <div className="card-footer">
                  <i>Do you wouch for <b>{application.get('name')}</b>?</i>
                </div>
              }
              <div className="card-footer flex flex-row justify-between items-center">
                { application.get('status') === 'open' ?
                  <button
                    onClick={ (e) => {
                      e.preventDefault();
                      updateApplication(application.get('_id'), 'conversation');
                    }}
                    className="btn-primary mr-4"
                  >
                    Start conversation
                  </button> :
                  application.get('status') === 'conversation'?
                    <button
                      onClick={ (e) => {
                        e.preventDefault();
                        updateApplication(application.get('_id'), 'approved', applicationMeta[application.get('_id')] || {});
                      }}
                      className="btn-primary mr-4"
                    >
                    Approve member
                    </button>:
                    <span />
                }
                <a
                  className="text-red-400"
                  href="#"
                  onClick={ (e) => {
                    e.preventDefault();
                    updateApplication(application.get('_id'), 'rejected');
                  }}
                >
                  Reject application
                </a>
              </div>
            </div>
          )
        }):
        <p className="py-4">No applications.</p>
      }

      <Pagination
        loadPage={ (page) => {
          setPage(page);
          loadData();
        }}
        page={ page }
        limit={ limit }
        total={ platform.application.findCount(filter) }
        items={ platform.application.find(filter) }
      />
    </div>
  )
};
ApplicationList.defaultProps = {
  status: 'open',
  limit: 10
};

export default ApplicationList;
