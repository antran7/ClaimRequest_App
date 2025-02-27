import { RouteObject } from "react-router-dom";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import UserManagement from "./pages/UserManagement";
import { Role } from "../../shared/constants/roles";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import ProjectDetail from "./pages/ProjectDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={[Role.ADMIN]} />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "managestaff",
        element: <UserManagement />,
      },
      {
        path: "manageproject",
        element: <ProjectManagementPage />,
      },
      {
        path: "manageproject/:projectId",
        element: <ProjectDetail />,
      },
    ],
  },
];