import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Profile from './../pages/Profile';
import ViewProfile from '../pages/ViewProfile';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Profile',
    children: <ViewProfile/>,
  },
  {
    key: '2',
    label: 'Edit Profile',
    children: <Profile/>,
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

const ProfileTab: React.FC = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default ProfileTab;