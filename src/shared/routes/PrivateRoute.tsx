import { Navigate, Outlet } from "react-router-dom";
import { Role } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  allowedRoles: Role[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && allowedRoles.includes(user.role as Role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default PrivateRoute;
