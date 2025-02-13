import { RouteObject } from "react-router-dom";
import PrivateRoute from "../../routes/PrivateRoute";
import { Role } from "../../constants/roles";


export const userRoutes: RouteObject[] = [
  // {
  //   path: "/users",
  //   element: <PrivateRoute allowedRoles={[Role.ADMIN]} />,
  //   children: [{ path: "", element: <UserManagement /> }],
  // },
];