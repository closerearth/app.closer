import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import api, { formatSearch } from '../utils/api';
import { usePlatform } from '../contexts/platform';

import ProfilePhoto from './ProfilePhoto';
import TimeSince from './TimeSince';
import Pagination from './Pagination';
import Tag from './Tag';
import Loading from './Loading';
import { useAuth } from '../contexts/auth.js';

const UsersTable = ({ where, limit }) => {

  const { user } = useAuth();
  const { platform } = usePlatform();
  const [page, setPage] = useState(1);
  const [addRole, setAddRole] = useState({});
  const [error, setErrors] = useState(false);
  const params = { where, sort_by: '-created', limit, page };
  const users = platform.user.find(params);
  const totalUsers = platform.user.findCount(params);
  const loading = platform.user.areLoading(params);

  const loadData = async () => {
    try {
      await Promise.all([
        platform.user.get(params),
        platform.user.getCount(params)
      ]);
    } catch (err) {
      console.log('Load error', err);
      setErrors(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [where, page]);

  return (
    <div className="users-table">
      <table className="card table-auto w-full">
        <thead className="card-header text-xs font-semibold uppercase text-gray-400 bg-gray-50">
          <tr>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Name</div>
            </th>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Created</div>
            </th>
            <th className="p-2 whitespace-nowrap">
              <div className="font-semibold text-left">Roles</div>
            </th>
          </tr>
        </thead>
        { loading ?
          <Loading />:
          <tbody class="text-sm divide-y divide-gray-100">
            { users && users.count() > 0 ?
              users.map((row) => {
                // Fetch the itemized object which can have been patched
                const user = platform.user.findOne(row.get('_id'));

                return (
                  <tr>
                    <td class="p-2 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                          <ProfilePhoto user={ user.toJS() } size="sm" />
                        </div>
                        <div class="font-medium text-gray-800">{ user.get('screenname') }</div>
                      </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="font-medium text-gray-800">
                          <TimeSince time={ user.get('created') } />
                        </div>
                      </div>
                    </td>
                    <td class="p-2 whitespace-nowrap">
                      <div className="space-x-1 flex flex-wrap justify-start items-start">
                        { user.get('roles') && user.get('roles').map(role => (
                          <Tag
                            key={ role }
                            color="green"
                            remove={ () => platform.user.patch(user.get('_id'), { roles: user.get('roles').filter(r => r !== role) }) }
                          >
                            { role }
                          </Tag>
                        )) }
                        <form
                          onSubmit={ (e) => {
                            e.preventDefault();
                            if (addRole[user.get('_id')]) {
                              platform.user.patch(user.get('_id'), { roles: user.get('roles').concat(addRole[user.get('_id')]) });
                              setAddRole({ ...addRole, [user.get('_id')]: '' });
                            } else {
                              console.log('Cannot add empty role!')
                            }
                          } }
                        >
                          <input
                            type="text"
                            value={ addRole[user.get('_id')] || '' }
                            placeholder="Add role"
                            onChange={ e => {
                              setAddRole({ ...addRole, [user.get('_id')]: e.target.value })
                            } }
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              }):
              <i>No users found</i>
            }
          </tbody>
        }
      </table>
      <div className="card-footer">
        <Pagination
          loadPage={ (page) => {
            setPage(page);
            loadData();
          }}
          page={ page }
          limit={ limit }
          total={ totalUsers }
          items={ users }
        />
      </div>
    </div>
  )
};
UsersTable.defaultProps = {
  limit: 50
}

export default UsersTable;
