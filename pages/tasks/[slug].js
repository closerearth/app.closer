import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Linkify from 'react-linkify';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api, { formatSearch, cdn } from '../../utils/api';
import MemberNav from '../../components/MemberNav';
import UploadPhoto from '../../components/UploadPhoto';
import CreatePost from '../../components/CreatePost';
import PostList from '../../components/PostList';
import ProfilePhoto from '../../components/ProfilePhoto';
import PageNotFound from '../404';
import { useAuth } from '../../contexts/auth.js';
import { __ } from '../../utils/helpers';

const Task = ({ task, error }) => {
  const [loadError, setErrors] = useState(null);
  const [status, setStatus] = useState(task && task.status);
  const { user, isAuthenticated } = useAuth();
  const [usersById, setUsersById] = useState({});
  const [applicants, setApplicants] = useState(task.applicants || []);
  if (user && user._id && !usersById[user._id]) {
    setUsersById({ ...usersById, [user._id]: user });
  }

  const apply = async (_id, application) => {
    try {
      const { data: { results: task } } = await api.post(`/apply/task/${_id}`, { application });
      setApplicants(task.applicants);
    } catch (err) {
      alert(`Could not apply: ${err.message}`)
    }
  }

  const updateStatus = async (_id, status) => {
    try {
      const { data: { results: task } } = await api.patch(`/task/${_id}`, { status });
      setStatus(task.status);
    } catch (err) {
      alert(`Could not update status: ${err.message}`)
    }
  }

  if (!task) {
    return <PageNotFound error={ error } />;
  }

  return (
    <Layout>
      <Head>
        <title>{ task.title }</title>
        <meta name="description" content={task.description} />
        <meta property="og:type" content="task" />
      </Head>
      <main className="fullwidth task-page main-content intro">
        <div className="columns">
          <div className="col lg two-third">
            <div>
              <h1>{task.title}</h1>
              { loadError && <div className="validation-error">{loadError}</div> }
              <section>
                <p className="about-text">
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        target="_blank"
                        rel="nofollow noreferrer"
                        href={decoratedHref}
                        key={key}
                        onClick={e => e.stopPropagation()}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {task.description}
                  </Linkify>
                </p>
              </section>
            </div>
          </div>
          <div className="col third">
            <div>
              <div className="card">
                {(isAuthenticated) &&
                  <section className="card-body">
                    <div className="action-row">
                      { user._id === task.createdBy ?
                        <div>
                          <Link as={`/tasks/edit/${task.slug}`} href="/tasks/edit/[slug]" legacyBehavior>{ __('tasks_slug_edit_task') }</Link>
                          <select
                            value={ status }
                            onChange={e => updateStatus(task._id, e.target.value)}
                          >
                            <option value="opening">
                              { __('tasks_slug_open') }
                            </option>
                            <option value="completed">
                              { __('tasks_slug_completed') }
                            </option>
                            <option value="closed">
                              { __('tasks_slug_closed') }
                            </option>
                            <option value="draft">
                              { __('tasks_slug_draft') }
                            </option>
                          </select>
                        </div>:
                        applicants?.includes(user._id) ?
                          <p className="text-small">
                            <a
                              href="#"
                              onClick={ e => {
                                e.preventDefault();
                                apply(task._id, !(applicants?.includes(user._id)));
                              }}
                            >
                              { __('tasks_slug_cancel_application') }
                            </a>
                          </p>:
                          <button
                            onClick={ e => {
                              e.preventDefault();
                              apply(task._id, !(applicants?.includes(user._id)));
                            }}
                          >
                            { __('tasks_slug_apply') }
                          </button>
                      }
                    </div>
                  </section>
                }
                { task.tags && task.tags.length > 0 &&
                    <div className="tags">
                      { task.tags.map(tag => (
                        (<Link
                        key={ tag }
                        as={`/search/${tag}`}
                        href="/search/[keyword]"
                        className="tag"
                        legacyBehavior>

                          <span className="ellipsis">{ tag }</span>

                        </Link>)
                      ))}
                    </div>
                }
                { user && (user._id === task.createdBy || (task.team && user._id === task.team[0])) &&
                  <section className="applicants card-body">
                    <h3>{ __('tasks_slug_applicants') }</h3>
                    <div className="user-list">
                      { applicants.length > 0 ?
                        applicants.map(uid => (
                          usersById[uid] &&
                            <Link
                              key={ uid }
                              as={`/members/${usersById[uid].slug}`}
                              href="/members/[slug]"
                              className="from user-preview"
                              legacyBehavior>

                              <ProfilePhoto size="sm" user={usersById[uid]} />
                              <span className="name">{ usersById[uid].screenname }</span>

                            </Link>
                        )):
                        'No applicants yet'
                      }
                    </div>
                  </section>
                }
                { task.rewards && task.rewards.length > 0 &&
                  <section className="rewards card-body">
                    <h3>{ __('tasks_slug_reward') }</h3>
                  </section>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
Task.getInitialProps = async ({ req, query }) => {
  try {
    const { data: { results: task } } = await api.get(`/task/${query.slug}`);
    return { task };
  } catch (err) {
    console.log('Error', err.message);

    return {
      error: err.message
    };
  }
}

export default Task;
