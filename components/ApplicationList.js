import React, { useState, useEffect } from 'react';
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
  const [canApproveList, setCanApproveList] = useState([]);
  const [applicationMeta, setApplicationMeta] = useState({});
  const [error, setErrors] = useState(false);
  const router = useRouter();
  const filter = {
    where: { status },
    limit,
    page
  };
  if (managedBy) {
    filter.where.managedBy = { $in: [managedBy] };
  }
  const applications = platform.application.find(filter);

  const loadData = async () => {
    try {
      platform.application.getCount(filter);
      platform.application.get(filter);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message)
    }
  };

  const updateApplication = async (id, status, app={}) => {
    try {
      const { data: { results: application } } = await api.post(`/admin/application/${id}`, { ...app, status });
      const updatedApps = applications.map(app => {
        if (app._id === id) {
          return application;
        }
        return app;
      });
    } catch (err) {
      console.log('Failed to approve application', err);
      setErrors(err.message)
    }
  }

  useEffect(() => {
    loadData();
  }, [managedBy, status, page]);

  return (
    <div className="application-list">
      { applications && applications.count() > 0 ?
        applications.map(application => (
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
                { canApproveList.includes(application.get('_id')) ?
                  <i>Do you wouch for <b>{application.get('name')}</b>?</i>:
                  <i>Did you have a conversation with <b>{application.get('name')}</b>?</i>
                }
              </div>
            }
            <div className="card-footer flex flex-row justify-between items-center">
              { application.get('status') !== 'conversation' ?
                <button
                  onClick={ (e) => {
                    e.preventDefault();
                    updateApplication(application.get('_id'), 'conversation');
                  }}
                  className="btn-primary mr-4"
                >
                  Start conversation
                </button> :
                canApproveList.includes(application.get('_id')) ?
                  <button
                  onClick={ (e) => {
                    e.preventDefault();
                    updateApplication(application.get('_id'), 'approved', applicationMeta[application.get('_id')] || {});
                  }}
                  className="btn-primary mr-4"
                >
                  Approve member
                </button>:
                <a
                  className="btn mr-4s"
                  href="#"
                  onClick={ (e) => {
                    e.preventDefault();
                    setCanApproveList(canApproveList.concat(application.get('_id')));
                  }}
                >
                  Yes
                </a>
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
        )):
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
