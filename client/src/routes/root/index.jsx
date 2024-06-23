import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Outlet, useLocation } from "react-router-dom";
import useLogout from "@/hooks/auth/useLogout";
import { useAlarmAlert } from "@/hooks/useAlarmAlert";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { getMinutesDifference } from "@/utils/helpers";

export default function Root() {
  const arr = ["/login", "/unauthorized"];
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { showSosAlert, showIdleAlert, showLowBatteryAlert, showDCSPopup } =
    useAlarmAlert();
  const { beacons, fetchBeacons } = useFetchBeacons();

  const logout = useLogout();

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      await logout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    for (const beacon of beacons) {
      if (beacon.isSosActive && !beacon.isInDcsRoom) {
        showSosAlert(beacon);
      } else if (beacon.isIdleActive && !beacon.isInDcsRoom) {
        showIdleAlert(beacon);
      } else if (beacon.isBatteryLow && !beacon.isInDcsRoom) {
        if (beacon.lowBattAckTime) {
          const minutesDifference = getMinutesDifference(beacon.lowBattAckTime);
          if (minutesDifference > 10) {
            showLowBatteryAlert(beacon);
          }
        } else {
          showLowBatteryAlert(beacon);
        }
      } else if (beacon.isInDcsRoom) {
        showDCSPopup(beacon);
      }
    }
  }, [beacons]);

  useEffect(() => {
    fetchBeacons();
    const fetchBeaconsInterval = setInterval(fetchBeacons, 300);

    return () => {
      clearInterval(fetchBeaconsInterval);
    };
  }, []);

  return location.pathname === "/login" ? (
    <Outlet />
  ) : (
    <Layout>
      <Outlet />
    </Layout>
  );
}
