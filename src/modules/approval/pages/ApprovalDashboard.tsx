import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Layout from "../../../shared/layouts/Layout";
import Approver from "./Approver";
import RequestPage from "./RequestPage";
import ApprovalPage from "./ApprovalPage";
import ApprovalSidebarDashboard from "./ApprovalSidebarDashboard";

const ApprovalDashboard = () => {
  const [currentSection, setCurrentSection] = useState<string>(
    () => localStorage.getItem("currentSection") || "profile"
  );

  useEffect(() => {
    const section = localStorage.getItem("currentSection");
    if (section) {
      setCurrentSection(section);
    }
  }, []);

  const renderContent = () => {
    switch (currentSection) {
      case "profile":
        return <Approver />;
      case "requests":
        return <RequestPage />;
      case "approve":
        return <ApprovalPage />;
      default:
        return <Approver />;
    }
  };

  return (
    <Layout>
      <Box sx={{ display: "flex" }}>
        <ApprovalSidebarDashboard
          isOpen={true}
          onPageChange={(page) => {
            setCurrentSection(page);
            localStorage.setItem("currentSection", page);
          }}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {renderContent()}
        </Box>
      </Box>
    </Layout>
  );
};

export default ApprovalDashboard;
