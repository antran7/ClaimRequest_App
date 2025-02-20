import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import Login from "../../modules/auth/pages/Login";
import Error from "../../modules/auth/pages/Error";
import { userRoutes } from "../../modules/users/routes";
import { adminRoutes } from "../../modules/admin/routes";
import { financeRoutes } from "../../modules/finance/routes";
import { approvalRoutes } from "../../modules/approval/routes";

import RequestPage from "../../modules/users/pages/request/RequestPage";
import AddRequestPage from "../../modules/users/components/request-comp/AddRequest";
import EditRequestPage from "../../modules/users/components/request-comp/EditRequest";
import Profile from "../../modules/admin/pages/Profile";
import AdminDashboard from "../../modules/admin/pages/AdminDashboard";
import React, { Suspense, useState, useEffect } from "react";

// Lazy load HomePage
const HomePage = React.lazy(() => import("../../modules/auth/pages/HomePage"));

// Component hiển thị khi tải trang
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <img
      src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
      alt="Logo"
      className="w-16 h-16 animate-spin mb-4"
    />
    <p className="text-lg font-semibold text-gray-600">Loading...</p>
  </div>
);

import { Toaster } from "react-hot-toast";
import Home from "../../modules/auth/pages/Home";


const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giữ màn hình loading 
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout); 
  }, []);

  return (
    <AuthProvider>
      <Router>

        <Suspense fallback={<LoadingScreen />}>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Error />} />
              <Route path="/requestpage" element={<RequestPage />} />
              <Route path="/addrequest" element={<AddRequestPage />} />
              <Route path="/editrequest/:id" element={<EditRequestPage />} />
              <Route path="/profile" element={<Profile    />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />

        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error />} />


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
          )}
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;



