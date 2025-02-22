import { RouteObject } from "react-router-dom";
import { Role } from "../../shared/constants/roles";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import ApprovalDashboard from "./pages/ApprovalDashboard";

export const approvalRoutes: RouteObject[] = [
  {
    path: "/approval",
    element: <PrivateRoute allowedRoles={[Role.APPROVER]} />,
    children: [
      {
        path: "dashboard",
        element: <ApprovalDashboard />,
      },
    ],
  },
];
