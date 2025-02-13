import { RouteObject } from "react-router-dom";
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