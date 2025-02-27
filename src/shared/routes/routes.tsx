import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import Login from "../../modules/auth/pages/Login";
import Error from "../../modules/auth/pages/Error";
import { userRoutes } from "../../modules/users/routes";
import { adminRoutes } from "../../modules/admin/routes";
import { financeRoutes } from "../../modules/finance/routes";
import { approvalRoutes } from "../../modules/approval/routes";
import { Toaster } from "react-hot-toast";
import Home from "../../modules/common/pages/Home";
import Contact from "../../modules/common/pages/Contact";
import Verify from "../../modules/auth/pages/Verify";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/unauthorized" element={<Error />} />
          <Route path="/contact" element={<Contact />} />

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
