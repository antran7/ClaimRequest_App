import { useState } from "react";
import "./Login.css";
import { Role } from "../../../shared/constants/roles";
import { useAuth } from "../../../shared/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Login = () => {
  const navigate = useNavigate();
  const { login, forgotPawssword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);

      const role = localStorage.getItem("userRole");
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
      toast.success('Login successfully!');
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

  const handleForgotPassword = async () => {
    try {
      await forgotPawssword();
      toast.success('Please check your email to get new password!');
    } catch(error) {
      console.error('Error:',error);
      toast.error("This didn't work.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-home-container">
          <Link to="/" className="login-home-link">HOME</Link>
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
            <div
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </div>
          </div>
          <button type="submit" className="login-submit">Sign in</button>
        </form>
      </div>
      <div className="login-right">
        <div className="login-background"></div>
      </div>
    </div>
  );
};

export default Login; 