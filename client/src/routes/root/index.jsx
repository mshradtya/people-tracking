import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Outlet, useLocation } from "react-router-dom";
import useLogout from "@/hooks/auth/useLogout";
import { useAlarmAlert } from "@/hooks/useAlarmAlert";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import BeaconDcsDialog from "@/components/modals/BeaconDcsDialog";

export default function Root() {
  const arr = ["/login", "/unauthorized"];
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { showSosAlert, showIdleAlert } = useAlarmAlert();
  const { beacons, fetchBeacons } = useFetchBeacons();
  const [dcsAlertOpen, setDcsAlertOpen] = useState(false);
  const [dcsBeacon, setDcsBeacon] = useState(null);

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

  const handleDcsAlertClose = async (bnid, beaconUser) => {
    const response = await axiosPrivate.post(
      `/beacon/update?LOCATION=DCS&BNID=${bnid}&USER=${beaconUser}`
    );
    if (response.status === 200) {
      setDcsAlertOpen(false);
      setDcsBeacon(null);
    }
  };

  useEffect(() => {
    const handleBeaconInDcs = async () => {
      for (const beacon of beacons) {
        if (beacon.isInDcsRoom) {
          setDcsBeacon(beacon);
          setDcsAlertOpen(true);
        }
      }
    };

    handleBeaconInDcs();

    for (const beacon of beacons) {
      if (beacon.isSosActive && !beacon.isInDcsRoom) {
        showSosAlert(beacon);
      } else if (beacon.isIdleActive && !beacon.isInDcsRoom) {
        showIdleAlert(beacon);
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
      <BeaconDcsDialog
        dcsAlertOpen={dcsAlertOpen}
        handleDcsAlertClose={handleDcsAlertClose}
        beacon={dcsBeacon}
      />
    </Layout>
  );
}
