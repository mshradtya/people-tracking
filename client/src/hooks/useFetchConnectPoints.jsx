import { useState } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchConnectPoints = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [connectPoints, setConnectPoints] = useState([]);
  const [isConnectPointsLoading, setIsConnectPointsLoading] = useState(true);
  const [connectPointsSerialNumber, setConnectPointsSerialNumber] = useState(1);
  const [connectPointsWithSOS, setConnectPointsWithSOS] = useState([]);

  const fetchConnectPoints = async () => {
    try {
      const response = await axiosPrivate.get("/connect-points");
      setConnectPoints(response.data.connectPoints);
      setIsConnectPointsLoading(false);
      setConnectPointsSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  const fetchConnectPointsWithSOS = async () => {
    try {
      const response = await axiosPrivate.get("/connect-point/sos");
      setConnectPointsWithSOS(response.data.connectPoints);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return {
    connectPoints,
    isConnectPointsLoading,
    connectPointsSerialNumber,
    fetchConnectPoints,
    connectPointsWithSOS,
    fetchConnectPointsWithSOS,
  };
};

export { useFetchConnectPoints };
