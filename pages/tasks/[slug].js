import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
import { currencies } from '../../components/EditModel';
import PostList from '../../components/PostList';
import ProfilePhoto from '../../components/ProfilePhoto';
import PageNotFound from '../404';
import { useAuth } from '../../contexts/auth.js';

const Task = ({ task, error }) => {

  const [loadError, setErrors] = useState(null);
  const [status, setStatus] = useState(task && task.status);
  if (!task) {
    return <PageNotFound error={ error } />;
  }

  const { user, isAuthenticated } = useAuth();
  const [usersById, setUsersById] = useState({});
  const [applicants, setApplicants] = useState(task.applicants || []);
  if (user && user._id && !usersById[user._id]) {
    setUsersById({ ...usersById, [user._id]: user });
  }

  const apply = async (_id, application) => {
    try {
      const {data: { results: task }} = await api.post(`/apply/task/${_id}`, { application });
      setApplicants(task.applicants);
    } catch (err) {
      alert(`Could not apply: ${err.message}`)
    }
  }

  const updateStatus = async (_id, status) => {
    try {
      const {data: { results: task }} = await api.patch(`/task/${_id}`, { status });
      setStatus(task.status);
    } catch (err) {
      alert(`Could not update status: ${err.message}`)
    }
  }

  return (
    <Layout>
      <Head>
        <title>{ task.title }</title>
        <meta name="description" content={task.description} />
        <meta property="og:type" content="task" />
      </Head>
      <main className="fullwidth task-page main-content intro">
        <div className={`columns intro`} className="columns">
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
                          <Link as={`/tasks/edit/${task.slug}`} href="/tasks/edit/[slug]"><a>Edit task</a></Link>
                          <select
                              value={ status }
                              onChange={e => updateStatus(task._id, e.target.value)}
                            >
                              <option value="opening">
                                Open
                              </option>
                              <option value="completed">
                                Completed
                              </option>
                              <option value="closed">
                                Closed
                              </option>
                              <option value="draft">
                                Draft
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
                            Cancel application
                          </a>
                        </p>:
                        <button
                          onClick={ e => {
                            e.preventDefault();
                            apply(task._id, !(applicants?.includes(user._id)));
                          }}
                        >
                          Apply for task
                        </button>
                      }
                    </div>
                  </section>
                }
                { task.tags && task.tags.length > 0 &&
                    <div className="tags">
                      { task.tags.map(tag => (
                        <Link key={ tag } as={`/search/${tag}`} href="/search/[keyword]">
                          <a className="tag">
                            <span className="ellipsis">{ tag }</span>
                          </a>
                        </Link>
                      ))}
                  </div>
                }
                { user && (user._id === task.createdBy || (task.team && user._id === task.team[0])) &&
                  <section className="applicants card-body">
                    <h3>Applicants</h3>
                    <div className="user-list">
                      { applicants.length > 0 ?
                        applicants.map(uid => (
                          usersById[uid] &&
                            <Link key={ uid } as={`/members/${usersById[uid].slug}`} href="/members/[slug]">
                              <a className="from user-preview">
                                <ProfilePhoto size="sm" user={usersById[uid]} />
                                <span className="name">{ usersById[uid].screenname }</span>
                              </a>
                            </Link>
                        )):
                        'No applicants yet'
                      }
                    </div>
                  </section>
                }
                { task.rewards && task.rewards.length > 0 &&
                  <section className="rewards card-body">
                    <h3>Rewards</h3>
                    { task.rewards.map(reward => {
                      const currency = currencies.find(c => c.value === reward.cur);
                      return (
                        <div className="reward" key={ JSON.stringify(reward) }>
                          <span className="symbol">{currency?.symbol}</span> <b>{reward.val}</b>
                        </div>
                      );
                    }) }
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
