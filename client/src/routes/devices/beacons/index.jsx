import { useState, useEffect } from "react";
import AddNewWearableModal from "@/components/modals/AddNewWearableModal";
import BeaconsTable from "./BeaconsTable";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useAxiosPrivate from "../../../hooks/auth/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";

export default function Beacons() {
  const [isBeaconDetailsOpen, setIsBeaconDetailsOpen] = useState(false);
  const [beacons, setBeacons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serialNumber, setSerialNumber] = useState(1);
  const { showSnackbar } = useSnackbar();

  // Context and hooks
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBeaconsInterval = setInterval(fetchBeacons, 500);

    return () => {
      clearInterval(fetchBeaconsInterval);
    };
  }, []);

  // Fetch devices from the server
  const fetchBeacons = async () => {
    try {
      const response = await axiosPrivate.get("/beacons");
      setBeacons(response.data.beacons);
      setIsLoading(false);
      setSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      navigate("/login", { state: location, replace: true });
    }
  };

  const handleRegisterBeacon = () => {
    setIsBeaconDetailsOpen(true);
  };

  const handleCloseBeaconDetails = () => {
    setIsBeaconDetailsOpen(false);
  };

  return (
    <>
      <div className="flex flex-row-reverse items-center w-full mb-4">
        <Button
          variant="outlined"
          startIcon={<AddCircleRoundedIcon />}
          onClick={handleRegisterBeacon}
        >
          Register Beacon
        </Button>
      </div>
      <BeaconsTable
        beacons={beacons}
        fetchBeacons={fetchBeacons}
        isLoading={isLoading}
        serialNumber={serialNumber}
      />
      {isBeaconDetailsOpen && (
        <AddNewWearableModal
          handleCloseBeaconDetails={handleCloseBeaconDetails}
          fetchBeacons={fetchBeacons}
        />
      )}
    </>
  );
}
