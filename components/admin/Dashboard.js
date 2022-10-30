import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import Loading from '../Loading';
import api from '../../utils/api';
import { useAuth } from '../../contexts/auth';
import PageNotAllowed from '../../pages/401';
import { usePlatform } from '../../contexts/platform';
import { theme } from '../../tailwind.config';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const metricsToPlot = ['user', 'ticket'];
const last30days = dayjs().subtract(30, 'days').format();
const metricFilter = { where: { created: { $gt: last30days } } };

const Dashboard = ({ token }) => {
  const { platform } = usePlatform();
  const { user, isLoading } = useAuth();
  const [email, setInviteEmail] = useState('');
  const [error, setError] = useState(null);
  const [invite, setInvite] = useState(null);

  const inviteUser = async () => {
    try {
      setError(null);
      setInvite(null);
      const res = await api.post('/generate-invite', { email });
      if (res.data.invite_link) {
        setInvite(res.data.invite_link);
        setInviteEmail('');
      } else {
        throw new Error('No invite_url returned.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  const loadData = async () => {
    await Promise.all(metricsToPlot.map(metric =>
      platform[metric].getGraph(metricFilter)
    ));
  }

  useEffect(() => {
    if (user && (user.roles.includes('admin') || user.roles.includes('analyst'))){
      loadData();
    }
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }
  if (!user || !user.roles.includes('admin')) {
    return <PageNotAllowed />;
  }

  return (
    <div className="admin-dashboard card">
      <div className="flex flex-row flex-wrap">
        { metricsToPlot.map(metric => {
          const data = platform[metric].findGraph(metricFilter);
          if (!data) {
            return <h4 key={ metric }>{ metric } not found.</h4>
          }
          return (
            <div key={ metric }>
              <Line
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `${metric}s per day`,
                    },
                  },
                }}
                data={{
                  labels: data.map(p => p.get('time')).toJS(),
                  datasets: [
                    {
                      label: '1',
                      data: data.map(p => p.get('value')).toJS(),
                      borderColor: theme.extend.colors.primary
                    }
                  ]
                }}
              />
            </div>
          );
        }) }
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          inviteUser(email);
        }}
        className="mt-8 w-1/2"
      >
        { invite &&
          <div className="success-box">
            Invite link:
            <input value={ invite } className="copy-box" disabled />
          </div>
        }
        { error &&
          <div className="error-box">
            { error }
          </div>
        }
        <div className="form-field">
          <label htmlFor="email">Get Invite Link</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="name@awesomeproject.co"
            onChange={e => setInviteEmail(e.target.value)}
            required
          />
        </div>
        <div className="card-footer">
          <div className="action-row">
            <button type="submit" className="btn-primary">
              Generate link
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;
