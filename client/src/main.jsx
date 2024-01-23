import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Root from "@/routes/root";
import PersistLogin from "@/components/auth/PersistLogin";
import Login from "./routes/auth/login";
import Dashboard from "@/routes/dashboard";
import Maps from "@/routes/maps";
import Users from "@/routes/users";
import Unauthorized from "@/routes/auth/unauthorized";
import RequireAuth from "@/components/auth/RequireAuth";
import ErrorPage from "@/routes/root/ErrorPage";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { AuthProvider } from "./context/AuthContext";
import { MapProvider } from "./context/MapContext";
import Test from "./routes/test";
import "./index.css";
// import Missing from "./pages/Missing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // public routes
      { path: "login", element: <Login /> },
      { path: "unauthorized", element: <Unauthorized /> },

      // protected routes
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth allowedRoles={["SuperAdmin"]} />,
            children: [
              { path: "", element: <Dashboard /> },
              { path: "maps", element: <Maps /> },
              { path: "users", element: <Users /> },
              { path: "test", element: <Test /> },
            ],
          },
        ],
      },
      // catch all
      // { path: "*", element: <Missing /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MapProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </MapProvider>
    </AuthProvider>
  </React.StrictMode>
);
