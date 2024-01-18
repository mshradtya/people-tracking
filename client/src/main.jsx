// import React from "react";
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Root from "@/routes/root";
// import LiveTracking from "@/routes/live-tracking";
// import Dashboard from "@/routes/dashboard";
// import Users from "@/routes/users";
// import ErrorPage from "@/routes/root/ErrorPage";
// import { SnackbarProvider } from "@/context/SnackbarContext";
// import { AuthProvider } from "./context/AuthContext";
// import "./index.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "dashboard",
//         element: <Dashboard />,
//       },
//       {
//         path: "live-tracking",
//         element: <LiveTracking />,
//       },
//       {
//         path: "users",
//         element: <Users />,
//       },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <SnackbarProvider>
//         <RouterProvider router={router} />
//       </SnackbarProvider>
//     </AuthProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Root from "@/routes/root";
import PersistLogin from "@/components/auth/PersistLogin";
import Login from "./routes/auth/login";
import Dashboard from "@/routes/dashboard";
import LiveTracking from "@/routes/live-tracking";
import Users from "@/routes/users";
import Unauthorized from "@/routes/auth/unauthorized";
import RequireAuth from "@/components/auth/RequireAuth";
import ErrorPage from "@/routes/root/ErrorPage";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { AuthProvider } from "./context/AuthContext";
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
              { path: "live-tracking", element: <LiveTracking /> },
              { path: "users", element: <Users /> },
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
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </AuthProvider>
  </React.StrictMode>
);
