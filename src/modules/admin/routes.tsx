import { RouteObject } from "react-router-dom";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import UserManagement from "./pages/UserManagement";
import { Role } from "../../shared/constants/roles";
import ProjectManagementPage from "./pages/ProjectManagementPage";

export const adminRoutes: RouteObject[] = [
  // {
  //   path: "/manage",
  //   element: <PrivateRoute allowedRoles={[Role.USER, Role.ADMIN]} />,
  //   children: [
  //     {
  //       path: "/users",
  //       element: <UserManagement />
  //     },
  //     {
  //       path: "/projects",
  //       element: <ProjectManagementPage />
  //     }
  //   ],
  // },
  {
    path: "/users",
    element: <UserManagement />,
  },
  {
    path: "/projectmanager",
    element: <ProjectManagementPage />,
  }
  // {
  //   path: "/admin-dashboard",
  //   element: <PrivateRoute allowedRoles={[Role.ADMIN]} />,
  //   children: [{ path: "", element: <AdminDashboard /> }],
  // },
];