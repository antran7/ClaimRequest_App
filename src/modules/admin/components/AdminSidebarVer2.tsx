import { Inbox, Mail } from "@mui/icons-material";
import { Box, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { List } from "antd";
import { Link } from "react-router";

function AdminSidebarVer2() {
  return (
    <div style={{width:"200px"}}>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
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
