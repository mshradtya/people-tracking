import { useState } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchGatewaysNotWorking = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [notWorkingGateways, setNotWorkingGateways] = useState([]);

  const fetchGatewaysNotWorking = async () => {
    try {
      const response = await axiosPrivate.get("/gateways/not-working");
      setNotWorkingGateways(response.data.notWorkingGateways);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return {
    notWorkingGateways,
    fetchGatewaysNotWorking,
  };
};

export { useFetchGatewaysNotWorking };
