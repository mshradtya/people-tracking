import { useState } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchBeaconUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [beaconUsers, setBeaconUsers] = useState([]);
  const [isBeaconUsersLoading, setIsBeaconUsersLoading] = useState(true);
  const [beaconUsersSerialNumber, setBeaconUsersSerialNumber] = useState(1);

  const fetchBeaconUsers = async () => {
    try {
      const response = await axiosPrivate.get("/beacon/users");
      setBeaconUsers(response.data.allBeaconUsers);
      setIsBeaconUsersLoading(false);
      setBeaconUsersSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return {
    beaconUsers,
    isBeaconUsersLoading,
    beaconUsersSerialNumber,
    fetchBeaconUsers,
  };
};

export { useFetchBeaconUsers };
