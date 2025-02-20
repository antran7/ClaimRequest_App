import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import { Role } from "../constants/roles";
import MenuIcon from "@mui/icons-material/Menu";  // Import Icon
import IconButton from "@mui/material/IconButton";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = localStorage.getItem("userRole") as Role | null;

  const handleLogOut = () => {
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
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
     
      <IconButton  onClick={toggleSidebar} color="inherit" className="menu-button">
        <div className="menuicon"> <MenuIcon /> </div>
        
      </IconButton>

      <div className="layout-header-left">Claim Request</div>

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
