import { Navigate, Outlet } from "react-router-dom";
import { Role } from "../constants/roles";
import { useAuth } from "../../modules/auth/services/useAuth";

interface PrivateRouteProps {
  allowedRoles: Role[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return role && allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default PrivateRoute;