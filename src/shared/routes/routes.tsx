import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../modules/auth/services/useAuth";
import Login from "../../modules/auth/pages/Login";
import Error from "../../modules/auth/pages/Error";
import { userRoutes } from "../../modules/users/routes";
import { adminRoutes } from "../../modules/admin/routes";
import { financeRoutes } from "../../modules/finance/routes";
import { approvalRoutes } from "../../modules/approval/routes";
import ProjectManagementPage from "../../modules/admin/pages/ProjectManagementPage";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error />} />
          <Route path="/projectmanager" element={<ProjectManagementPage/>}/>

          {/* Import route từ các module */}
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route key={childIndex} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}

          {userRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route key={childIndex} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}

          {approvalRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route key={childIndex} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}

          {financeRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route key={childIndex} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;