import { useState } from "react";
import "./Login.css";
import { Role } from "../../../shared/constants/roles";
import { useAuth } from "../../../shared/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("Thành công!");
  
      const role = localStorage.getItem("userRole");
      console.log("Role là: ", role);
      switch (role) {
        case Role.ADMIN:
          navigate("/admin/dashboard");
          break;
        case Role.USER:
          navigate("/user/dashboard");
          break;
        case Role.APPROVER:
          navigate("/approval/dashboard");
          break;
        case Role.FINANCE:
          navigate("/finance/claims");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      toast.error("Thông tin đăng nhập không chính xác!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-home-container">
          <Link to="/" className="login-home-link">HOME.</Link>
        </div>
        
        <img
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="#"
          width="100px"
          draggable="false"
          className="login-logo"
        />
        <h1 className="login-title">Sign in to your account</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-options">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a className="forgot-password" href="">Forgot password?</a>
          </div>
          <button type="submit" className="login-submit">Sign in</button>
        </form>
      </div>
      <div className="login-right">
        <div className="login-background"></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login; 