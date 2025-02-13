import { RouteObject } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";
import { Role } from "../../constants/roles";
import UserManagement from "./pages/UserManagement";

export const userRoutes = [
  {
    path: "/users",
    element: <UserManagement />, // REMOVE PrivateRoute TEMPORARILY
  },
];


//export const userRoutes: RouteObject[] = [
 // {
   //  path: "/users",
     //element: <PrivateRoute allowedRoles={[Role.ADMIN]} />,
     //children: [{ path: "", element: <UserManagement /> }],
   //},
//];