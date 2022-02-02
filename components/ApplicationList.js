import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import api, { formatSearch } from '../utils/api';
import TimeSince from './TimeSince';

import models from '../models';
import { useAuth } from '../contexts/auth.js';

const ApplicationList = ({ children, channel, status, managedBy }) => {

  const { user } = useAuth();
  const [applications, setApplications] = useState(null);
  const [canApproveList, setCanApproveList] = useState([]);
  const [applicationMeta, setApplicationMeta] = useState({});
  const [error, setErrors] = useState(false);
  const router = useRouter();

  const loadData = async () => {
    try {
      const where = formatSearch({
        status,
        managedBy: managedBy && { $in: [managedBy] }
      });
      const params = { sort_by: '-created', where };
      const { data: { results: applications } } = await api.get('/application', { params });
      setApplications(applications);
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
      setApplications(updatedApps)
    } catch (err) {
      console.log('Failed to approve application', err);
      setErrors(err.message)
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="application-list">
      { applications && applications.length > 0 ?
        applications.filter(app => app.status !== 'approved').map(application => (
          <div key={ application._id } className="application-preview card">
            <div className="card-title">
              <h3>{ application.name }</h3>
              <div>
                <TimeSince time={ application.created } />
                {' '}
                <span className="tag">{application.status}</span>
              </div>
            </div>
            <div className="card-body">
              { models.application.map(({ label, name, status }) => (
                <div key={ name }>
                  <p>
                    <i>{label}</i><br />
                    {application[name]}
                  </p>
                </div>
              )) }
              {application.status !== 'conversation' &&
                <p></p>
              }
            </div>
            <div className="card-footer">
              { application.status !== 'conversation' ?
                <button
                  onClick={ (e) => {
                    e.preventDefault();
                    updateApplication(application._id, 'conversation');
                  }}
                  className="btn-primary"
                >
                  Start conversation
                </button> :
                canApproveList.includes(application._id) ?
                  <div>
                    <label>From your conversation, would you say this member will adhere to the values in the Pink Paper?</label>
                    <fieldset>
                      <div className="radio-group">
                        <label for="adheres">Yes</label>
                        <input
                          type="radio"
                          onChange={ (e) => {
                            // e.preventDefault();
                            setApplicationMeta({
                              ...applicationMeta,
                              [application._id]: {
                                ...(applicationMeta[application._id] || {}),
                                adheres: true
                              }
                            })
                          } }
                          name="adheres"
                          id="adheres"
                          value="Yes"
                        />
                      </div>
                      <div className="radio-group">
                        <label for="noadheres">No</label>
                        <input
                          type="radio"
                          onChange={ (e) => {
                            setApplicationMeta({
                              ...applicationMeta,
                              [application._id]: {
                                ...(applicationMeta[application._id] || {}),
                                adheres: true
                              }
                            })
                          } }
                          name="adheres"
                          id="noadheres"
                          value="No"
                        />
                      </div>
                    </fieldset>
                    <fieldset>
                      <label>What about this person resonated with you?</label>
                      <textarea
                        value={ (applicationMeta[application._id] || {}).reviewer_liked || '' }
                        onChange={ (e) => {
                          e.preventDefault();
                          setApplicationMeta({
                            ...applicationMeta,
                            [application._id]: {
                              ...(applicationMeta[application._id] || {}),
                              reviewer_liked: e.target.value
                            }
                          })
                        } }
                      />
                    </fieldset>
                    <button
                      onClick={ (e) => {
                        e.preventDefault();
                        updateApplication(application._id, 'approved', applicationMeta[application._id] || {});
                      }}
                      className="btn-primary"
                    >
                      Yes, approve member
                    </button>
                </div>:
                <div>
                  <p>Did you have a conversation with {application.name}?</p>
                  <a
                    className="btn"
                    href="#"
                    onClick={ (e) => {
                      e.preventDefault();
                      setCanApproveList(canApproveList.concat(application._id));
                    }}
                  >
                    Yes
                  </a>
                </div>
              }
              <a
                className="text-red-400"
                href="#"
                onClick={ (e) => {
                  e.preventDefault();
                  updateApplication(application._id, 'rejected');
                }}
              >
                Reject application
              </a>
            </div>
          </div>
        )):
        <p>No applications.</p>
      }
    </div>
  )
};
ApplicationList.defaultProps = {
  status: 'open'
};

export default ApplicationList;
