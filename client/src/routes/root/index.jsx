import React from "react";
import Layout from "./Layout";
import { Outlet, useLocation } from "react-router-dom";

export default function Root() {
  const arr = ["/login", "/unauthorized"];
  const location = useLocation();

  return location.pathname === "/login" ? (
    <Outlet />
  ) : (
    <Layout>
      <Outlet />
    </Layout>
  );
}
