import { Navigate, Outlet } from "react-router-dom";
import { Role } from "../constants/roles";
import { useAuth } from "../modules/auth/hooks/useAuth";

interface PrivateRouteProps {
  allowedRoles: Role[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { role } = useAuth();

  return role && allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;