import { RouteObject } from "react-router-dom";
import { Role } from "../../shared/constants/roles";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import ApprovalPage from "./pages/ApprovalPage";

export const approvalRoutes: RouteObject[] = [
  {
    path: "/approval",
    element: <ApprovalPage />,
    // Khi cần bảo mật, có thể thêm
    // element: <PrivateRoute allowedRoles={[Role.APPROVAL]} />,
    // children: [{ path: "", element: <ApprovalPage /> }],
  },
];
