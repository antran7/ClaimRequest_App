import React from "react";
import { Tabs } from "antd";

import Topbar from "../../components/topbar/Topbar";
import HouseIcon from "@mui/icons-material/House";
import BadgeIcon from '@mui/icons-material/Badge';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import User from "./User";
import Home from "./Home";
import RequestPage from "../request/RequestPage";
import AddRequestPage from "../../components/request-comp/AddRequest";

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
          {
            key: "3",
            label: (
              <span className="tab-item">
                <RequestPageIcon className="Icon"/>
                My Request
              </span>
            ),
            children: <RequestPage />,
          },
          {
            key: "4",
            label: (
              <span className="tab-item">
                <RequestPageIcon className="Icon"/>
                Add request
              </span>
            ),
            children: <AddRequestPage />,
          },
        ]}
      />
    </>
  );
};

export default UserDashboard;
