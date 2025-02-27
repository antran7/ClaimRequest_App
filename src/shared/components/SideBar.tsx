import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import HouseIcon from "@mui/icons-material/House";
import BadgeIcon from "@mui/icons-material/Badge";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate } from "react-router-dom";
import { Role } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar = ({ isOpen, toggleSidebar }: SideBarProps) => {
  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const role = localStorage.getItem("userRole");
  const [openManagement, setOpenManagement] = useState(false);

  const menuItems = [
    { text: "Home", icon: <HouseIcon />, path: "/" },
    {
      text: "Dashboard",
      icon: <BadgeIcon />,
      path: "dashboard",
    },
    {
      text: "My Requests",
      icon: <RequestPageIcon />,
      path: "/my-requests",
    },
  ];

  const adminItems = [
    {
      text: "Management",
      icon: <BusinessRoundedIcon />,
      children: [
        {
          text: "Manage Staff",
          icon: <PeopleAltRoundedIcon />,
          path: "/admin/managestaff",
        },
        {
          text: "Manage Project",
          icon: <AssignmentTurnedInRoundedIcon />,
          path: "/admin/manageproject",
        },
      ],
    },
  ];

  const approvalItems = [
    {
      text: "Approve Claims",
      icon: <CheckBoxIcon />,
      path: "/approval/dashboard",
    },
  ];

  const finaceItems = [{ text: "Paid Claims", icon: <PaidIcon />, path: "/#" }];

  const handleNavigation = (path: string) => {
    console.log(role);
    if (path === "/dashboard") {
      if (role === "user") {
        navigate("/user/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "approver") {
        navigate("/approval/dashboard");
      } else {
        navigate("/finance/claims");
      }
    } else {
      navigate(path);
    }
    toggleSidebar();
  };

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        await getUserInfo();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAuth();
  });

  return (
    <Drawer open={isOpen} onClose={toggleSidebar}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleNavigation(path)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        {/* Admin Management */}
        <List>
          {role === Role.ADMIN &&
            adminItems.map(({ text, icon, children }) => (
              <Box key={text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setOpenManagement(!openManagement)}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                    {openManagement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                </ListItem>

                {/* Hiển thị danh sách con nếu openManagement === true */}
                <Collapse in={openManagement} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {children.map(({ text, icon, path }) => (
                      <ListItem key={text} disablePadding sx={{ pl: 1 }}>
                        <ListItemButton onClick={() => handleNavigation(path)}>
                          <ListItemIcon>{icon}</ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}

          {role === Role.APPROVER &&
            approvalItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleNavigation(path)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}

          {role === Role.FINANCE &&
            finaceItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleNavigation(path)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;
