import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
} from "@mui/material";
import {
  Home,
  Person as Profile,
  Description as Request,
} from "@mui/icons-material";

interface ApprovalSidebarDashboardProps {
  isOpen: boolean;
  onPageChange: (page: string) => void;
  currentPage: string;
}

const drawerWidth = 240;

const menuItems = [
  {
    text: "Home",
    icon: <Home />,
    id: "home",
  },
  {
    text: "Profile",
    icon: <Profile />,
    id: "profile",
  },
  {
    text: "My Request",
    icon: <Request />,
    id: "request",
  },
];

const ApprovalSidebarDashboard: React.FC<ApprovalSidebarDashboardProps> = ({
  isOpen,
  onPageChange,
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : 64,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : 64,
          boxSizing: "border-box",
          transition: "width 0.2s ease-in-out",
          overflowX: "hidden",
          backgroundColor: "#f5f5f5",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          whiteSpace: "nowrap",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "hidden" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => onPageChange(item.id)}
              sx={{
                minHeight: 48,
                justifyContent: isOpen ? "initial" : "center",
                px: 2.5,
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Box
                sx={{
                  width: isOpen ? "auto" : 0,
                  overflow: "hidden",
                  transition: "width 0.2s ease-in-out",
                }}
              >
                <ListItemText primary={item.text} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default ApprovalSidebarDashboard;
