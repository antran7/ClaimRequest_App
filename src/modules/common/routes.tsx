import { RouteObject } from "react-router";
import PrivateRoute from "../../shared/routes/PrivateRoute";
import { Role } from "../../shared/constants/roles";
import Home from "./pages/Home";
import Login from "../auth/pages/Login";
import ForgotPassword from "../auth/pages/ForgotPassword";
import Verify from "../auth/pages/Verify";
import Error from "../auth/pages/Error";
import About from "./pages/About";
import Contact from "./pages/Contact";

export const commonRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Home />
    },

    {
        path: "/login",
        element: <Login />,
        children: [
            {
                path: "forgotpassword",
                element: <ForgotPassword />,
            }
        ]
    },

    {
        path: "/verify",
        element: <Verify />
    },

    {
        path: "/unauthorized",
        element: <Error />,
    },

    {
        path: "/about",
        element: <About />,
    },

    {
        path: "/contact",
        element: <Contact />,
    },

    {
        path: "/profile",
        element: <PrivateRoute allowedRoles={
            [
                Role.ADMIN,
                Role.APPROVER,
                Role.FINANCE,
                Role.USER,
            ]
        }
        />

    }
]