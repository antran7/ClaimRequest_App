import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "../modules/auth/pages/Error";
import { userRoutes } from "../modules/users/routes";
import { dashboardRoutes } from "../modules/dashboard/routes";
import { AuthProvider } from "../modules/auth/hooks/useAuth";
import Login from "../modules/auth/pages/Login";
import { profileRoutes } from "../modules/profile/routes";
import { adminRoutes } from "../modules/admin/routes";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error/>} />

          {/* Import route từ các module */}
          {dashboardRoutes.map((route, index) => (
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
            {profileRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route key={childIndex} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}
            {adminRoutes.map((route, index) => (
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