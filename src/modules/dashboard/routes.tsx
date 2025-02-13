import { RouteObject } from "react-router-dom";
import { Role } from "../../constants/roles";
import PrivateRoute from "../../routes/PrivateRoute";
import UserDashboard from "./UserDashboard";
// import UserList from "./pages/userlist/Userlist";
// import Home from "./pages/Home/Home";



export const dashboardRoutes: RouteObject[] = [

  {
    path: "/dashboarduser",
    element: <PrivateRoute allowedRoles={[Role.USER, Role.ADMIN]} />,
    children: [{ path: "", element: <UserDashboard/> },
      
    ],
    
  },
 
];