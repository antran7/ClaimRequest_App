import { RouteObject } from "react-router-dom";
import { Role } from "../../constants/roles";
import PrivateRoute from "../../routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <PrivateRoute allowedRoles={[Role.USER, Role.ADMIN]} />,
    children: [{ path: "", element: <Dashboard /> }],
  },
  
];
