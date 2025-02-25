import { Inbox, Mail } from "@mui/icons-material";
import { Box, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { List } from "antd";
import { Link } from "react-router";

function AdminSidebarVer2() {
  return (
    <div style={{ width: "300px" }}>
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem key="Home" disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem key="User Management" disablePadding>
            <ListItemButton component={Link} to="/manageuser">
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Project Management" disablePadding>
              <ListItemButton component={Link} to="/manageproject"> 
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary="Project Management" />
              </ListItemButton>
            </ListItem>
          
        </List>
        <Divider />
        <List>
        
          <ListItem key="Profile" disablePadding>
            <ListItemButton component={Link} to="/admin/profile">
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );
}

export default AdminSidebarVer2;
