import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router";

interface AdminSidebarDashboardProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebarDashboard({ isOpen, toggleSidebar }: AdminSidebarDashboardProps) {
  const navigate = useNavigate();

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleSidebar} onKeyDown={toggleSidebar}>
      <List>
        {["Summary", "User Management", "Project Management", "Drafts"].map((text, index) => (
               <ListItem key={text} disablePadding>
               <ListItemButton
                 onClick={() => {
                   if (text === 'User Management') {
                     navigate('/user-management');
                   }if (text === 'Summary') {
                    navigate('/admin-dashboard');
                  }if (text === 'Project Management') {
                    navigate('/project-management');
                  }
                   toggleSidebar();
                 }}

               >
                 <ListItemIcon>
                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                 </ListItemIcon>
                 <ListItemText primary={text} />
               </ListItemButton>
             </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer open={isOpen} onClose={toggleSidebar}>
      {list()}
    </Drawer>
  );
}
