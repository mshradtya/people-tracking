import { useState, useEffect } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchConnectPointsNotWorking = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [notWorkingConnectPoints, setNotWorkingConnectPoints] = useState([]);

  const fetchConnectPointsNotWorking = async () => {
    try {
      const response = await axiosPrivate.get("/connect-points/not-working");
      setNotWorkingConnectPoints(response.data.notWorkingConnectPoints);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return {
    notWorkingConnectPoints,
    fetchConnectPointsNotWorking,
  };
};

export { useFetchConnectPointsNotWorking };
