import { useState, useEffect } from "react";
import ConnectPointsTable from "./ConnectPointsTable";
import AddNewConnectPointModal from "../../../components/modals/AddNewConnectPointModal";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useAxiosPrivate from "../../../hooks/auth/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";

export default function ConnectPoints() {
  const [isGatewayDetailsOpen, setIsGatewayDetailsOpen] = useState(false);
  const [connectPoints, setConnectPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serialNumber, setSerialNumber] = useState(1);
  const { showSnackbar } = useSnackbar();

  // Context and hooks
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch devices from the server
  const fetchConnectPoints = async () => {
    try {
      const response = await axiosPrivate.get("/connect-points");
      setConnectPoints(response.data.connectPoints);
      setIsLoading(false);
      setSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      // navigate("/login", { state: location, replace: true });
    }
  };

  useEffect(() => {
    fetchConnectPoints();
  }, []);

  const handleRegisterGateway = () => {
    setIsGatewayDetailsOpen(true);
  };

  const handleCloseConnectPointDetails = () => {
    setIsGatewayDetailsOpen(false);
  };

  return (
    <>
      <div className="flex flex-row-reverse items-center w-full mb-4">
        <Button
          variant="outlined"
          startIcon={<AddCircleRoundedIcon />}
          onClick={handleRegisterGateway}
        >
          Register Connect Point
        </Button>
      </div>
      <ConnectPointsTable
        connectPoints={connectPoints}
        fetchConnectPoints={fetchConnectPoints}
        isLoading={isLoading}
        serialNumber={serialNumber}
      />
      {isGatewayDetailsOpen && (
        <AddNewConnectPointModal
          handleCloseConnectPointDetails={handleCloseConnectPointDetails}
          fetchConnectPoints={fetchConnectPoints}
        />
      )}
    </>
  );
}
