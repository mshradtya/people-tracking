import { useState } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchGateways = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [gateways, setGateways] = useState([]);
  const [isGatewaysLoading, setIsGatewaysLoading] = useState(true);
  const [gatewaysSerialNumber, setGatewaysSerialNumber] = useState(1);
  const [gatewaysWithSOS, setGatewaysWithSOS] = useState([]);

  const fetchGateways = async () => {
    try {
      const response = await axiosPrivate.get("/gateways");
      setGateways(response.data.gateways);
      setIsGatewaysLoading(false);
      setGatewaysSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  const fetchGatewaysWithSOS = async () => {
    try {
      const response = await axiosPrivate.get("/gateway/sos");
      setGatewaysWithSOS(response.data.gateways);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return {
    gateways,
    isGatewaysLoading,
    gatewaysSerialNumber,
    fetchGateways,
    gatewaysWithSOS,
    fetchGatewaysWithSOS,
  };
};

export { useFetchGateways };
