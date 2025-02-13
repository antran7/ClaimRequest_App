import { RouteObject } from "react-router-dom";
import { Role } from "../../constants/roles";
import PrivateRoute from "../../routes/PrivateRoute";
import UserDashboard from "./UserDashboard";
import User from "./pages/Profile/User";


export const dashboardRoutes: RouteObject[] = [

  {
    path: "/dashboarduser",
    element: <PrivateRoute allowedRoles={[Role.USER, Role.ADMIN]} />,
    children: [{ path: "", element: <UserDashboard /> },

    ],

  },
  {
    path: "/profile",
    element: <PrivateRoute allowedRoles={[Role.USER, Role.ADMIN]} />,
    children: [{ path: "", element: <User /> },

    ],

  },

];


