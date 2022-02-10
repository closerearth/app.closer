import React from 'react';
import Tabs from './Tabs';

const adminTabs = [
  {
    title: 'Dashboard',
    href: '/admin',
    value: 'dashboard'
  },
  {
    title: 'Users',
    href: '/admin/users',
    value: 'users',
  },
];

const AdminNav = ({ activeTab }) => (
  <div>
    <Tabs
      initialCurrentTab={ adminTabs.findIndex(t => t.value === activeTab) }
      tabs={ adminTabs }
    />
  </div>
);
AdminNav.defaultProps = {
  activeTab: 'dashboard'
}

export default AdminNav;
