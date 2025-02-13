import { RouteObject } from "react-router-dom";
import { Role } from "../../constants/roles";
import PrivateRoute from "../../routes/PrivateRoute";
import PaidPage from "./pages/PaidPage";

// export const requestRoutes: RouteObject[] = [
//   {
//     path: "/finance/claims",
//     element: <PrivateRoute allowedRoles={[Role.FINANCE]} />,
//     children: [{ path: "", element: <PaidPage /> }],
//   },
// ];
export const requestRoutes: RouteObject[] = [
  {
    path: "/finance/claims",
    element: <PaidPage />, // Bỏ PrivateRoute tạm thời để test
  },
];
