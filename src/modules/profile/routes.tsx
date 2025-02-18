import { RouteObject } from "react-router";
import PrivateRoute from "../../routes/PrivateRoute";
import { Role } from "../../constants/roles";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";


export const profileRoutes: RouteObject[] = [
    {
      path: "/profile",
      element: <PrivateRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
      children: [{ path: "", element: <Profile /> }],
    },
    {
      path: "/profilePage",
      element: <PrivateRoute allowedRoles={[Role.ADMIN, Role.USER]} />,
      children: [{ path: "", element: <ProfilePage /> }],
    },
  ];