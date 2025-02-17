import { RouteObject } from "react-router-dom";
import { Role } from "../../constants/roles";
import PrivateRoute from "../../routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <PrivateRoute allowedRoles={[Role.USER, Role.ADMIN]} />,
    children: [{ path: "", element: <Dashboard /> }],
  },
  {
    path: "/admin-dashboard",
    element: <PrivateRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
    children: [{ path: "", element: <AdminDashboard /> }],
  },
];