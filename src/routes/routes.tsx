import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "../modules/auth/pages/Error";
import { userRoutes } from "../modules/users/routes";
import { dashboardRoutes } from "../modules/dashboard/routes";
import { AuthProvider } from "../modules/auth/hooks/useAuth";
import Login from "../modules/auth/pages/Login";
import { requestRoutes } from "../modules/requests/routes";
import RequestPage from "../modules/requests/pages/RequestPage";
import AddRequest from "../modules/requests/pages/AddRequest";
import EditRequest from "../modules/requests/pages/EditRequest";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error />} />
          <Route path="/requestpage" element={<RequestPage />} />
          <Route path="/addrequest" element={<AddRequest />} />
          <Route path="/editrequest/:id" element={<EditRequest />} />

          {/* Import route từ các module */}
          {dashboardRoutes.map((route, index) => (
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

          {requestRoutes.map((route, index) => (
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
