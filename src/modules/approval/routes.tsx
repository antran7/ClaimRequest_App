import { Navigate, RouteObject } from "react-router-dom";
import { Role } from "../../shared/constants/roles";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import RequestPage from "./pages/ApproveRequestPage";

export const approvalRoutes: RouteObject[] = [
  {
    path: "/approval",
    element: <PrivateRoute allowedRoles={[Role.APPROVER]} />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />
      },
      {
        path: "dashboard",
        element: <ApprovalDashboard />,
      },
      {
        path: "my-requests",
        element: <RequestPage />,
      },
    ],
  },
];
