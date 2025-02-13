import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "../modules/auth/pages/Error";
import { userRoutes } from "../modules/users/routes";
import { dashboardRoutes } from "../modules/dashboard/routes";
import { AuthProvider } from "../modules/auth/hooks/useAuth";
import Login from "../modules/auth/pages/Login";
import RequestPage from "../request_page/RequestPage";
import AddRequest from "../request_page/AddRequest";
import EditRequest from "../request_page/EditRequest";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Error/>} />
          <Route path="/requestpage" element={<RequestPage/>} />
          <Route path="/addrequest" element={<AddRequest/>} />
          <Route path="/editrequest/:id" element={<EditRequest/>} />

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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;