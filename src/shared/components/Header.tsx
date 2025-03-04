import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import React, { useEffect, useState } from "react";
import { Role } from "../constants/roles";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../../core/hooks/useAuth";
import { Menu, MenuItem } from "@mui/material";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar = () => { } }: HeaderProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token") as Role | null;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    logout();
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <div className="layout-header">

      <div className="layout-header-left">
        {isLoggedIn && (
          <IconButton
            onClick={toggleSidebar}
            color="inherit"
            style={{ marginRight: '10px' }}
          >
            <MenuIcon style={{ fontSize: '30px' }} />
          </IconButton>
        )}
        <p>Claim Management</p>
      </div>

      <div className="layout-header-right">
        <Link to="/#" className="header-right-item">
          Services
        </Link>
        <Link to="/about" className="header-right-item">
          About
        </Link>
        <Link to="/Contact" className="header-right-item">
          Contact
        </Link>
        {!isLoggedIn ? (
          <Link to="/login" className="header-right-item">
            Log In
          </Link>
        ) : (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              disableScrollLock={true} // Giữ thanh cuộn
            >
              <MenuItem onClick={handleClose}>
                My Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <button onClick={handleLogOut}>
                  Log Out
                </button>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
