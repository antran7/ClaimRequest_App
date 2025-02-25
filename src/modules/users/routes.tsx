import { RouteObject } from "react-router-dom";
import UserDashboard from "./pages/user-dashboard/UserDashboard";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import { Role } from "../../shared/constants/roles";


export const userRoutes: RouteObject[] = [
    {
        path: "/user",
        element: <PrivateRoute allowedRoles={
            [
                Role.USER,
                Role.APPROVER,
                Role.FINANCE,
                Role.ADMIN
            ]
        }
        />,
        children: [
            {
                path: "dashboard",
                element: <UserDashboard />
            },
        ],
    },
];