import { Navigate, Outlet } from "react-router-dom";
import { Role } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  allowedRoles: Role[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { loading } = useAuth();
  const role = localStorage.getItem("userRole");
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return allowedRoles.includes(role as Role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default PrivateRoute;