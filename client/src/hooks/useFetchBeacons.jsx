import { useState, useEffect } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchBeacons = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [beacons, setBeacons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serialNumber, setSerialNumber] = useState(1);

  useEffect(() => {
    const updateBeaconAck = async (bnid) => {
      try {
        await axiosPrivate.post(
          `/beacon/update/ack?bnid=${bnid}&ack=true&sos=H`
        );
      } catch (error) {
        showSnackbar("error", error.response.data.message);
      }
    };

    const handleBeaconUpdates = async () => {
      for (const beacon of beacons) {
        if (beacon.sos === "H" && !beacon.userAck) {
          await updateBeaconAck(beacon.bnid);
        }
      }
    };

    handleBeaconUpdates();
  }, [beacons]);

  const fetchBeacons = async () => {
    try {
      const response = await axiosPrivate.get("/beacons");
      setBeacons(response.data.beacons);
      setIsLoading(false);
      setSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return { beacons, isLoading, serialNumber, fetchBeacons };
};

export { useFetchBeacons };
