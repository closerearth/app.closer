import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import api from '../../utils/api'
import { EN, SIGNUP_FIELDS } from '../../config'

const Signup = () => {
  const [submitted, setSubmitted] = useState(false);
  const [application, setApplication] = useState({
    name: '',
    phone: '',
    email: '',
    fields: {},
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
  const updateApplicationFields = update => setApplication({ ...application, fields: { ...application.fields, ...update } });

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
            { SIGNUP_FIELDS && SIGNUP_FIELDS.map(field => (
              <div className="w-full mb-4" key={ field.name }>
                <label htmlFor={ field.name }>
                  { field.label }
                </label>
                <textarea
                  className="textarea"
                  id={ field.name }
                  value={ application.fields[field.name] }
                  onChange={ e => updateApplicationFields({ [field.name]: e.target.value }) }
                  placeholder={ field.placeholder }
                />
              </div>
            )) }
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
