import { RouteObject } from "react-router-dom";
import { Role } from "../../shared/constants/roles";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import PaidPage from "./pages/PaidPage";

export const financeRoutes: RouteObject[] = [
  {
    path: "/finance",
    element: <PrivateRoute allowedRoles={[Role.FINANCE]} />,
    children: [
      {
        path: "claims",
        element: <PaidPage />
      }
    ],
  },
];
