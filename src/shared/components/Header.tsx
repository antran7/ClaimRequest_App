import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import { Role } from "../constants/roles";

const Header = () => {
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
    <div className="layout-header">
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
