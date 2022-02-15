import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { useAuth } from '../../contexts/auth';

const Login = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    router.push('/');
  }

  return (
    <Layout>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="mural">
        <main className="main-content center intro">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email, password);
            }}
          >
            <div className="w-full mb-4">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full"
                type="email"
                name="email"
                id="email"
                value={email}
                placeholder="name@awesomeproject.co"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-full mb-4">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full"
                type="password"
                name="password"
                id="password"
                value={password}
                placeholder="*****"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="card-footer">
              <div className="action-row">
                <button type="submit" className="btn-primary">
                  Sign in
                </button>
                <hr className="my-4"/>
                <p>
                  <Link href="/login/forgot-password" as="/login/forgot-password"><a>Forgot password?</a></Link>
                </p>
              </div>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
}

export default Login;
