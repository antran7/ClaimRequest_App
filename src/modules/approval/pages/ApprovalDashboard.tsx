import React, { useState } from "react";
import { Box } from "@mui/material";
import ApprovalHeaderDashboard from "./ApprovalHeaderDashboard";
import ApprovalSidebarDashboard from "./ApprovalSidebarDashboard";
import ApprovalPage from "./ApprovalPage";
import Approver from "./Approver";
import RequestPage from "./RequestPage";
import "./ApprovalDashboard.css";

interface PageContent {
  [key: string]: React.ReactNode;
}

const ApprovalDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const pageContent: PageContent = {
    home: <ApprovalPage />,
    profile: <Approver />,
    request: <RequestPage />,
  };

  const renderContent = () => {
    return pageContent[currentPage] || pageContent.home;
  };

  return (
    <Box sx={{ display: "flex", margin: 0, padding: 0 }}>
      <ApprovalHeaderDashboard toggleSidebar={toggleSidebar} />
      <ApprovalSidebarDashboard
        isOpen={isSidebarOpen}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          backgroundColor: "#f5f5f5",
          paddingTop: "64px",
          marginLeft: isSidebarOpen ? "-370px" : "-540px",
          transition: "margin-left 0.2s",
        }}
      >
        <Box
          sx={{
            padding: 0,
            width: "100%",
            margin: 0,
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default ApprovalDashboard;
