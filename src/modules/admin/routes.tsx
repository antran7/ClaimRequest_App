import { RouteObject } from "react-router-dom";
import LayoutAdmin from "./components/LayoutAdmin"; // Import LayoutAdmin

import PrivateRoute from "../../shared/routes/PrivateRoute";
import UserManagement from "./pages/UserManagement";
import { Role } from "../../shared/constants/roles";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={[Role.ADMIN]} />,
    children: [      
        
          {
            path: "dashboard",
            element: <AdminDashboard />,
            },{
              path: "profile",
              element: <Profile />,
            },
            {
              path: "edit-profile",
              element: <EditProfile />,
            },
            {
              path: "manageuser",
              element: <UserManagement />,
            },
            {
              path: "manageproject",
              element: <ProjectManagementPage />,
            },
          

      
    ],
  },
];
