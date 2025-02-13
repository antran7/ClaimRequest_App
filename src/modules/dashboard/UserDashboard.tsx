import React from "react";
import { Tabs } from "antd";

import Home from "./pages/Home/Home";
import Topbar from "./topbar/Topbar";
import HouseIcon from "@mui/icons-material/House";
import BadgeIcon from '@mui/icons-material/Badge';
import User from "./pages/Profile/User";

const UserDashboard: React.FC = () => {
  return (
    <>
      <Topbar />
      <Tabs
        tabPosition="left"
        items={[
          {
            key: "1",
            label: (
              <span className="tab-item">
                <HouseIcon className="Icon"/>
                Home
              </span>
            ),
            children: <Home />,
          },
          {
            key: "2",
            label: (
                <span className="tab-item">
                  <BadgeIcon className="Icon"/> 
                  Profile
                </span>
              ),
            children: <User />,
          },
        ]}
      />
    </>
  );
};

export default UserDashboard;
