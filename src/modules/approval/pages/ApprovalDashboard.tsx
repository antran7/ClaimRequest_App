import React, { useState } from "react";
import { Box } from "@mui/material";
import ApprovalPage from "./ApprovalPage";
import Approver from "./Approver";
import RequestPage from "./RequestPage";
import "./ApprovalDashboard.css";
import Layout from "../../../shared/layouts/Layout";

interface PageContent {
  [key: string]: React.ReactNode;
}

const ApprovalDashboard: React.FC = () => {
  const [currentPage] = useState("home");

  const pageContent: PageContent = {
    home: <ApprovalPage />,
    profile: <Approver />,
    request: <RequestPage />,
  };

  const renderContent = () => {
    return pageContent[currentPage] || pageContent.home;
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", margin: 0, padding: 0 }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            backgroundColor: "#f5f5f5",
            paddingTop: "64px",
            marginLeft: "-540px",
            transition: "margin-left 0.2s",
          }}
        >
          <Box sx={{ padding: 0, width: "100%", margin: 0 }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default ApprovalDashboard;