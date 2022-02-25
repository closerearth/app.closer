import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import SignupForm from '../../components/SignupForm'
import ApplicationForm from '../../components/ApplicationForm'
import { EN, REGISTRATION_MODE } from '../../config'

const Signup = () => (
  <Layout>
    <Head>
      <title>{ EN.signup_title }</title>
    </Head>
    <main className="main-content mt-12 px-4 max-w-prose mx-auto">
      <h1 className="mb-2">{ EN.signup_title }</h1>
      <p className="mb-8">{ EN.signup_body }</p>
      { REGISTRATION_MODE === 'curated'?
        <ApplicationForm />:
        <SignupForm />
      }
    </main>
  </Layout>
);

export default Signup;
