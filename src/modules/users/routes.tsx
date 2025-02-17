import { RouteObject } from "react-router-dom";
import UserDashboard from "./pages/user-dashboard/UserDashboard";


export const userRoutes: RouteObject[] = [
    {
        path: "/dashboarduser",
        element: <UserDashboard />,
    },
    //  {
    //     path: "/users",
    //      element: <PrivateRoute allowedRoles={[Role.ADMIN]} />,
    //      children: [{ path: "", element: <UserManagement /> }],
    //    },
];