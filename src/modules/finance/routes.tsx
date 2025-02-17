import { RouteObject } from "react-router-dom";
import { Role } from "../../shared/constants/roles";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import PaidPage from "./pages/PaidPage";

export const financeRoutes: RouteObject[] = [
  {
    path: "/finance/claims",
    element: <PaidPage />, // Bỏ PrivateRoute tạm thời để test
    // Khi cần bảo mật, có thể uncomment đoạn dưới
    // element: <PrivateRoute allowedRoles={[Role.FINANCE]} />,
    // children: [
    //   {
    //     path: "",
    //     element: <PaidPage />
    //   }
    // ],
  },
];
