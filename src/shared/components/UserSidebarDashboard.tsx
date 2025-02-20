import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HouseIcon from "@mui/icons-material/House";
import BadgeIcon from "@mui/icons-material/Badge";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import HomeIcon from "@mui/icons-material/Home";
import Home from "../../modules/users/pages/user-dashboard/Home";
import User from "../../modules/users/pages/user-dashboard/User";
import RequestPage from "../../modules/users/pages/request/RequestPage";

interface UserSidebarDashboardProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function UserSidebarDashboard({
  isOpen,
  toggleSidebar,
}: UserSidebarDashboardProps) {
  const navigate = useNavigate(); // ✅ Di chuyển vào trong component
  const [selectedTab, setSelectedTab] = useState("Home");

  const menuItems = [
    { text: "Home", icon: <HouseIcon /> },
    { text: "Profile", icon: <BadgeIcon /> },
    { text: "My Requests", icon: <RequestPageIcon /> },
    { text: "Home Page", icon: <HomeIcon />, path: "/" }, // ✅ Thêm path cho Home Page
  ];

  const handleMenuClick = (text: string, path?: string) => {
    if (path) {
      navigate(path); // ✅ Điều hướng nếu có đường dẫn
    } else {
      setSelectedTab(text);
    }
  };

  return (
    <>
      <Drawer open={isOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleMenuClick(text, path)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Render nội dung của tab (không render nếu chọn Home Page vì đã navigate) */}
      <Box sx={{ padding: 2 }}>
        {selectedTab === "Home" && <Home />}
        {selectedTab === "Profile" && <User />}
        {selectedTab === "My Requests" && <RequestPage />}
      </Box>
    </>
  );
}
