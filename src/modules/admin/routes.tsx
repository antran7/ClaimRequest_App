import { RouteObject } from "react-router-dom";
import { Role } from "../../constants/roles";
import PrivateRoute from "../../routes/PrivateRoute";
import UserManagementPage from "./pages/UserManagementPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectManagement from "./pages/ProjectManagement";


export const adminRoutes: RouteObject[] = [
  {
    path: "/admin-dashboard",
    element: <PrivateRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
    children: [{ path: "", element: <AdminDashboard /> }],
  },
  {
    path: "/user-management",
    element: <PrivateRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
    children: [{ path: "", element: <UserManagementPage /> }],
  },
  {
    path: "/project-management",
    element: <PrivateRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
    children: [{ path: "", element: <ProjectManagement /> }],
  },
];