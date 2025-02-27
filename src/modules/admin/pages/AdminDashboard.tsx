import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";
import { AccountCircleOutlined, Folder } from "@mui/icons-material";
import { Grid } from "@mui/material";

import { useNavigate } from "react-router-dom";
import Layout from "../../../shared/layouts/Layout";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function AdminDashboard() {
  const navigate = useNavigate();

  const data = {
    labels: ["Admin", "Approval", "Finance", "User"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(36, 250, 118, 0.2)",
        ],
      },
    ],
  };
  const claimRequestData = {
    labels: ["Pending", "Approved", "Rejected", "Paid"],
    datasets: [
      {
        label: "Claim Requests",
        data: [40, 25, 10, 30], 
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)", 
          "rgba(54, 162, 235, 0.7)", 
          "rgba(255, 206, 86, 0.7)", 
          "rgba(36, 250, 118, 0.7)", 
        ],
      },
    ],
  };

  return (
    <div>
      <Layout>
        <div className="admin-dashboard-container">
          <div className="content-dashboard">
            <h2>Welcome!</h2>
            <Grid container spacing={10} className="items-card">
              <Grid item xs={2} onClick={() => navigate("/admin/manageuser")}>
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
              <Grid item xs={2} onClick={() => navigate("/admin/manageproject")}>
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
              <Grid item xs={2}>
                <div className="processcing-card">
                  <div className="processcing-card-left">
                    <p>Request procescing</p>
                    <p>20</p>
                  </div>
                  <div className="user-card-right">
                    <Folder style={{ fontSize: "50px" }} />
                  </div>
                </div>
              </Grid>
              <Grid item xs={2}>
                <div className="processced-card">
                  <div className="processced-card-left">
                    <p>Request processed</p>
                    <p>20</p>
                  </div>
                  <div className="user-card-right">
                    <Folder style={{ fontSize: "50px" }} />
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <div className="chart-container">
                  <p style={{ textAlign: "center", margin: "20px", fontSize: "20px", color: "#418c9f" }}>Users</p>
                  <Doughnut data={data} />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="bar-chart">
                <p style={{ textAlign: "center", margin: "20px", fontSize: "20px", color: "#418c9f" }}>Claim Request</p>
                  <Bar data={claimRequestData} />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default AdminDashboard;
