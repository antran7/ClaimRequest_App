import "./topbar.css";
import { Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import { LogoutOutlined } from "@ant-design/icons";
import { handleLogout } from "../../../../shared/utils/auth";

function Topbar() {
  const navigate = useNavigate();

  const menu = (
    <Menu className="avatar-dropdown-menu">
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => handleLogout(navigate)}
        className="logout-menu-item"
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="topbar">
      <div className="topbarWraper">
        <div className="topLeft">
          <span className="logo">dashboarduser</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsIcon />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <LanguageIcon />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <SettingsIcon />
          </div>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            placement="bottomRight"
            arrow
          >
            <img
              src="https://yt3.googleusercontent.com/YaAFWY03ER0DfF77HAyMqNlRxmJiSEDq_I7ZF0MlcgRcVzOhIhZfB8QlwNhAuVXZesi2I2zy=s900-c-k-c0x00ffffff-no-rj"
              alt=""
              className="topAvatar"
            />
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
