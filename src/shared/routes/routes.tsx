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
import ApprovalDashboard from "../../modules/approval/pages/ApprovalDashboard";
import ApprovalPage from "../../modules/approval/pages/ApprovalPage";
import LoadingScreen from "../components/LoadingScreen";
import { useState,useEffect } from "react";
import Contact from "../../modules/common/pages/Contact";


const AppRoutes = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   // Hiển thị LoadingScreen trong 2 giây
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

  // if (isLoading) return <LoadingScreen />; // Hiện trang loading trước

  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/approval/dashboard" element={<ApprovalDashboard />}>
            <Route path="home" element={<ApprovalPage />} />
            <Route path="profile" element={<div>Profile Content</div>} />
            <Route path="request" element={<div>Request Content</div>} />
            <Route path="history" element={<div>History Content</div>} />
          </Route>

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
