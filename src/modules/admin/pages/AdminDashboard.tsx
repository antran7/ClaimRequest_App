import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";
import { AccountCircleOutlined, Folder } from "@mui/icons-material"; 
import { Col, Row } from "antd";

import { useNavigate } from "react-router-dom";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import AdminSidebarVer2 from "../components/AdminSidebarVer2";

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
      <Header />    
      <div className="include-all">
        <div className="sidebar-admin">      <AdminSidebarVer2/>  
        </div>
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
            </Col>
            <Col span={6} onClick={() => navigate("/admin/manageproject")}>
              <div className="project-card">
                <div className="project-card-left">
                  <p>Project</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <Folder style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="project-card">
                <div className="project-card-left">
                  <p>Request procescing</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <Folder style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="project-card">
                <div className="project-card-left">
                  <p>Request processed</p>
                  <p>20</p>
                </div>
                <div className="user-card-right">
                  <Folder style={{ fontSize: "50px" }} />
                </div>
              </div>
            </Col>
          </Row>

          <div className="chart-container">
            <Doughnut data={data} />
          </div>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
}

export default AdminDashboard;
