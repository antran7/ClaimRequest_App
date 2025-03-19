import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { TextField, Checkbox, FormControlLabel, Button, CircularProgress } from "@mui/material";
import { getUserInfo, login } from "../services/authService";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      const user = await getUserInfo();
      switch (user.data?.role_code) {
        case "A001":
          navigate("/admin");
          break;
        case "A002":
          navigate("/finance");
          break;
        case "A003":
          navigate("/approval");
          break;
        case "A004":
          navigate("/user");
          break;
        default:
          navigate("/");
      }
      toast("Login successfully.", {
        icon: "🔥",
      });
    } catch (error) {
      toast(error.toString(), {
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-home-container">
          <Link to="/" className="login-home-link">HOME</Link>
          <Link to="/verify" className="login-verify-link">Verify Account</Link>

        </div>

        <img
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="#"
          width="100px"
          draggable="false"
          className="login-logo"
        />
        <h1 className="login-title">Sign in to your account</h1>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <div className="login-options">
            <FormControlLabel
              control={<Checkbox {...register("remember")} color="primary" />}
              label="Remember me"
            />
            <div className="forgot-password" onClick={() => navigate("/forgotpassword")}>
              Forgot password?
            </div>
          </div>
          <div className="verify" onClick={() => navigate("/verify")}>
            Verify Account
          </div>
          <Button type="submit" variant="contained" fullWidth disabled={isLoading} className="login-submit">
            {isLoading ? <CircularProgress size={24} /> : "Sign in"}
          </Button>
        </form>
      </div>
      <div className="login-right">
        <div className="login-background"></div>
      </div>
    </div>
  );
};

export default Login;