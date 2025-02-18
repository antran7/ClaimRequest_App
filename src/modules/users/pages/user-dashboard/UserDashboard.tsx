import React, { useState } from "react";


import UserSidebarDashboardProps from "../../../../shared/components/UserSidebarDashboard";
import AdminHeaderDashboard from "../../../../shared/components/AdminHeaderDashboard";


const UserDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AdminHeaderDashboard toggleSidebar={toggleSidebar} /> 
      <UserSidebarDashboardProps isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* <Home/> */}
      {/* <Tabs tabPosition="left">
        <Tabs.TabPane
          key="1"
          tab={
            <span className="tab-item">
              <HouseIcon className="Icon" />
              Home
            </span>
          }
        >
          <Home />
        </Tabs.TabPane>

        <Tabs.TabPane
          key="2"
          tab={
            <span className="tab-item">
              <BadgeIcon className="Icon" />
              Profile
            </span>
          }
        >
          <User />
        </Tabs.TabPane>

        <Tabs.TabPane
          key="3"
          tab={
            <span className="tab-item">
              <RequestPageIcon className="Icon" />
              My Request
            </span>
          }
        >
          <RequestPage />
        </Tabs.TabPane>

        <Tabs.TabPane
          key="4"
          tab={
            <span className="tab-item">
              <RequestPageIcon className="Icon" />
              Add Request
            </span>
          }
        >
          <AddRequestPage />
        </Tabs.TabPane>
      </Tabs> */}
    </>
  );
};

export default UserDashboard;
