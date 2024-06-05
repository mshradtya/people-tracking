import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Root from "@/routes/root";
import PersistLogin from "@/components/auth/PersistLogin";
import Login from "./routes/auth/login";
import Dashboard from "@/routes/dashboard";
import { styled } from "@mui/material";
import Maps from "@/routes/maps";
import Users from "@/routes/users";
import Unauthorized from "@/routes/auth/unauthorized";
import RequireAuth from "@/components/auth/RequireAuth";
import ErrorPage from "@/routes/root/ErrorPage";
import { NotificationProvider } from "@/context/NotificationContext";
import { AlarmAlertProvider } from "./context/AlarmAlertContext";
import { AuthProvider } from "./context/AuthContext";
import { MapProvider } from "./context/MapContext";
import { SnackbarProvider, MaterialDesignContent } from "notistack";
import Test from "./routes/test";
import Devices from "./routes/devices";
import SOSHistory from "./routes/history";
import Trial from "./routes/trial";
import "./index.css";
import { Navigate } from "react-router-dom";
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
            element: <RequireAuth allowedRoles={["User", "SuperAdmin"]} />,
            children: [
              { path: "", element: <Navigate to="/maps" replace /> },
              { path: "maps", element: <Maps /> },
              { path: "devices", element: <Devices /> },
              { path: "users", element: <Users /> },
              { path: "history", element: <SOSHistory /> },
              { path: "trial", element: <Trial /> },
            ],
          },
          {
            element: <RequireAuth allowedRoles={["SuperAdmin"]} />,
            children: [
              { path: "", element: <Navigate to="/maps" replace /> },
              { path: "maps", element: <Maps /> },
              { path: "devices", element: <Devices /> },
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

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-error": {
    backgroundColor: "red",
    height: "60px",
    fontWeight: "500",
    fontSize: "20px",
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: "#FF4500",
    height: "60px",
    fontWeight: "500",
    fontSize: "20px",
  },
}));

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <MapProvider>
      <SnackbarProvider
        hideIconVariant
        Components={{
          error: StyledMaterialDesignContent,
          warning: StyledMaterialDesignContent,
        }}
      >
        <AlarmAlertProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </AlarmAlertProvider>
      </SnackbarProvider>
    </MapProvider>
  </AuthProvider>
);
