import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../modules/auth/services/useAuth";
import Login from "../../modules/auth/pages/Login";
import Error from "../../modules/auth/pages/Error";
import { userRoutes } from "../../modules/users/routes";
import { adminRoutes } from "../../modules/admin/routes";
import { financeRoutes } from "../../modules/finance/routes";
import { approvalRoutes } from "../../modules/approval/routes";
import RequestPage from "../../modules/users/pages/RequestPage";
import AddRequestPage from "../../modules/users/components/AddRequest";
import EditRequestPage from "../../modules/users/components/EditRequest";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error />} />
          <Route path="/requestpage" element={<RequestPage />} />
          <Route path="/addrequest" element={<AddRequestPage />} />
          <Route path="/editrequest/:id" element={<EditRequestPage />} />

          {/* Import route từ các module */}
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}

          {userRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}

          {approvalRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}

          {financeRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
