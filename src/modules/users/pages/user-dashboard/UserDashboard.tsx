import React, { useState } from "react";


import UserSidebarDashboardProps from "../../../../shared/components/UserSidebarDashboard";
import AdminHeaderDashboard from "../../../admin/components/AdminHeaderDashboard";



const UserDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AdminHeaderDashboard toggleSidebar={toggleSidebar} /> 
      <UserSidebarDashboardProps isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default UserDashboard;
