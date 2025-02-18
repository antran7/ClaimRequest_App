import { RouteObject } from "react-router-dom";
import { Role } from "../../shared/constants/roles";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import ApprovalPage from "./pages/ApprovalPage";

export const approvalRoutes: RouteObject[] = [
  {
    path: "/approval",
    element: <PrivateRoute allowedRoles={[Role.APPROVER]} />,
    children: [
      {
        path: "dashboard",
        element: <ApprovalPage />
      }
    ],
  },
];
