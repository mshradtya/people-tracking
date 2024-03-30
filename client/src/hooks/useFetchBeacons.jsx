import { useState } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchBeacons = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [beacons, setBeacons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serialNumber, setSerialNumber] = useState(1);

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
