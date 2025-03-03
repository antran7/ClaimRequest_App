import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Layout from "../../../shared/layouts/Layout";

import ApprovalPage from "./ApprovalPage";

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
      case "approve":
        return <ApprovalPage />;
      default:
        return <ApprovalPage />;
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 2 }}>{renderContent()}</Box>
    </Layout>
  );
};

export default ApprovalDashboard;
