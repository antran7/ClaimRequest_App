import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import { Role } from "../constants/roles";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  toggleSideBar: () => void;
}

const Header = ({ toggleSideBar }: HeaderProps) => {
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
    console.log("Moi nhat: ", isLoggedIn);
    console.log("Moi nhat: ", user);
  }, [user]);

  return (
    <div
      className="layout-header"
      style={{
        padding: isLoggedIn ? "20px 40px 20px 25px" : "20px 50px",
      }}
    >
      <div className="layout-header-left">
        {isLoggedIn && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            style={{
              padding: '0',
            }}
            onClick={toggleSideBar}
          >
            <MenuIcon />
          </IconButton>
        )}
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
