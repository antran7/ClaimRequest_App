import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";
import { AccountCircleOutlined, Folder } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useState } from "react";
import AdminHeaderDashboard from "../components/AdminHeaderDashboard";
import AdminSidebarDashboard from "../components/AdminSidebarDashboard";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
      },
    ],
  };

  return (
    <div>
      <AdminHeaderDashboard toggleSidebar={toggleSidebar} />
      <AdminSidebarDashboard
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="admin-dashboard-container">
        <div className="header"></div>
        <div className="content-dashboard">
          <h2>Welcome!</h2>
          <p>This is the admin dashboard.</p>
          <Row className="items-card">
            <Col span={6} onClick={() => navigate("/admin/manageuser")}>
              <div className="user-card">
                <div className="user-card-left">
                  <p>Users</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <AccountCircleOutlined style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Grid>
            <Grid item xs={3} onClick={() => navigate("/admin/manageproject")}>
              <div className="project-card">
                <div className="project-card-left">
                  <p>Project</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <Folder style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="project-card">
                <div className="project-card-left">
                  <p>Request processing</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <Folder style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="project-card">
                <div className="project-card-left">
                  <p>Request processed</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <Folder style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Grid>
          </Grid>

          <div className="chart-container">
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
