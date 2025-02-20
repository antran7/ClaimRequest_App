import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HouseIcon from "@mui/icons-material/House";
import BadgeIcon from "@mui/icons-material/Badge";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface SideBarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const SideBar = ({ isOpen, toggleSidebar }: SideBarProps) => {
    const navigate = useNavigate();
    const { role } = useAuth();

    const menuItems = [
        { text: "Home", icon: <HouseIcon />, path: "/" },
        { text: "Dashboard", icon: <BadgeIcon />, path: "/dashboard" },
        { text: "My Claims", icon: <RequestPageIcon />, path: "/my-requests" },
    ];

    const handleNavigation = (path: string) => {
        console.log(role);
        if (path === "/dashboard") {
            if (role === "user") {
                navigate("/user/dashboard");
            }else if (role === "admin") {
                navigate("/admin/dashboard");
            }else if (role === "approver") {
                navigate("/approval/dashboard");
            }else {
                navigate("/finance/claims");
            }
        }else {
            navigate(path);
        }
        toggleSidebar();
    };

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
            </Box>
        </Drawer>
    );
};

export default SideBar;