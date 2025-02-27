import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";
import { AccountCircleOutlined, Folder } from "@mui/icons-material";
import { Grid } from "@mui/material";

import { useNavigate } from "react-router-dom";
import Layout from "../../../shared/layouts/Layout";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();

  

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
    <Layout>
    <div className="admin-dashboard-container">
        <div className="content-dashboard">
          <h2>Welcome!</h2>
          <Grid container spacing={2} className="items-card">
            <Grid item xs={3} onClick={() => navigate("/admin/manageuser")}>
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
            <Grid item xs={3}>
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

          <div className="chart-container">
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </Layout>    
    </div>
  );
}

export default AdminDashboard;
