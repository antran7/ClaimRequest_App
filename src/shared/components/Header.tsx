import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import { Role } from "../constants/roles";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = localStorage.getItem("userRole") as Role | null;

  const handleLogOut = () => {
    logout();
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  return (
    <div className="layout-header">

      <div className="layout-header-left">
        <IconButton
          onClick={toggleSidebar}
          color="inherit"
          style={{ marginRight: '10px' }}
        >
          <div> <MenuIcon style={{ fontSize: '30px' }}/> </div>

        </IconButton>
        <p>Claim Request</p>
      </div>

      <div className="layout-header-right">
        <Link to="/#" className="header-right-item">
          Services
        </Link>
        <Link to="/#" className="header-right-item">
          About
        </Link>
        <Link to="/#" className="header-right-item">
          Contact
        </Link>
        {!isLoggedIn ? (
          <Link to="/login" className="header-right-item">
            Log In
          </Link>
        ) : (
          <button onClick={handleLogOut} className="header-right-item">
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
