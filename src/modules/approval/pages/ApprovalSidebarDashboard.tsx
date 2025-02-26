import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  ListItemButton,
} from "@mui/material";
import {
  Person as ProfileIcon,
  Description as RequestIcon,
  CheckCircle as ApproveIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

interface ApprovalSidebarDashboardProps {
  isOpen: boolean;
  onPageChange: (page: string) => void;
}

const drawerWidth = 240;

const ApprovalSidebarDashboard = ({
  isOpen,
  onPageChange,
}: ApprovalSidebarDashboardProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, id: "home" },
    { text: "Profile", icon: <ProfileIcon />, id: "profile" },
    { text: "My Requests", icon: <RequestIcon />, id: "requests" },
    { text: "Approve Claims", icon: <ApproveIcon />, id: "approve" },
  ];

  const handleMenuClick = (id: string) => {
    if (id === "home") {
      navigate("/");
    } else {
      onPageChange(id);
      localStorage.setItem("currentSection", id);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleMenuClick(item.id)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default ApprovalSidebarDashboard;
