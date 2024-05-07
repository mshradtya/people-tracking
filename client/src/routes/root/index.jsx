import React, { useEffect } from "react";
import Layout from "./Layout";
import { Outlet, useLocation } from "react-router-dom";
import useLogout from "@/hooks/auth/useLogout";

export default function Root() {
  const arr = ["/login", "/unauthorized"];
  const location = useLocation();

  const logout = useLogout();

  // useEffect(() => {
  //   const handleBeforeUnload = async (event) => {
  //     await logout();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return location.pathname === "/login" ? (
    <Outlet />
  ) : (
    <Layout>
      <Outlet />
    </Layout>
  );
}
