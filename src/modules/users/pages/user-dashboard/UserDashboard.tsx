import React, { useState } from "react";
import Header from "../../../../shared/components/Header";
import UserSidebarDashboard from "../../../../shared/components/UserSidebarDashboard";
import Footer from "../../../../shared/components/Footer";



const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <UserSidebarDashboard isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Footer/>
    </>
  );
};

export default AdminDashboard;
