import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import api from '../../utils/api'
import { EN } from '../../config'

const Signup = () => {
  const [submitted, setSubmitted] = useState(false);
  const [application, setApplication] = useState({
    name: '',
    phone: '',
    email: '',
    community: '',
    source: typeof window !== 'undefined' && window.location.href
  });
  const submit = async (e) => {
    e.preventDefault();
    if (!application.email || !application.phone) {
      alert('Please enter an email & phone.');
      return;
    }
    try {
      await api.post('/application', application);
      setSubmitted(true);
    } catch (err) {
      alert('There was an error sending your application, please try again.');
    }
  }

  const updateApplication = update => setApplication({ ...application, ...update });

  return (
    <Layout>
      <Head>
        <title>{ EN.signup_title }</title>
      </Head>
      <main className="main-content mt-12 px-4 max-w-prose mx-auto">
        <h1 className="mb-2">{ EN.signup_title }</h1>
        <p className="mb-8">{ EN.signup_body }</p>
        { submitted?
          <h2 className="my-4">{ EN.signup_success }</h2>:
          <form className="join mt-24 flex flex-col" onSubmit={ submit }>
            <div className="w-full mb-4">
              <label htmlFor="screenname">
                Name
              </label>
              <input id="screenname" type="text" onChange={ e => updateApplication({ name: e.target.value }) } placeholder="Jane Birkin" />
            </div>
            {/* <div className="w-full mb-4">
              <label htmlFor="home">
                What is home to you?
              </label>
              <textarea id="home" value={ application.home } onChange={ e => updateApplication({ home: e.target.value }) } placeholder="Home is where..." />
            </div> */}
            <div className="w-full mb-4">
              <label htmlFor="community">
                Tell us about your community
              </label>
              <textarea className="textarea" id="community" value={ application.community } onChange={ e => updateApplication({ community: e.target.value }) } placeholder="" />
            </div>
            <div className="w-full mb-4">
              <label htmlFor="phone">
                Phone number
              </label>
              <input type="phone" required id="phone" value={ application.phone } onChange={ e => updateApplication({ phone: e.target.value }) } placeholder="+1 777 888 999" />
            </div>
            <div className="w-full mb-4">
              <label htmlFor="email">
                Email
              </label>
              <input type="email" id="email" required value={ application.email } onChange={ e => updateApplication({ email: e.target.value }) } placeholder="you@project.co" />
            </div>
            <div className="w-full mb-4">
              <button id="signupbutton" className="btn-primary" type="submit">Apply</button>
            </div>
          </form>
        }
      </main>
    </Layout>
  );
}

export default Signup;
