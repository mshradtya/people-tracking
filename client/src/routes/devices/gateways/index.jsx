import { useState, useEffect } from "react";
import GatewaysTable from "./GatewaysTable";
import AddNewGatewayModal from "@/components/modals/AddNewGatewayModal";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useAuth from "../../../hooks/auth/useAuth";
import useAxiosPrivate from "../../../hooks/auth/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";

export default function Gateways() {
  const [isGatewayDetailsOpen, setIsGatewayDetailsOpen] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serialNumber, setSerialNumber] = useState(1);
  const { showSnackbar } = useSnackbar();

  // Context and hooks
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch devices from the server
  const fetchGateways = async () => {
    try {
      const response = await axiosPrivate.get("/gateways");
      setGateways(response.data.gateways);
      setIsLoading(false);
      setSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      navigate("/login", { state: location, replace: true });
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleRegisterGateway = () => {
    setIsGatewayDetailsOpen(true);
  };

  const handleCloseGatewayDetails = () => {
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
          Register Gateway
        </Button>
      </div>
      <GatewaysTable
        gateways={gateways}
        fetchGateways={fetchGateways}
        isLoading={isLoading}
        serialNumber={serialNumber}
      />
      {isGatewayDetailsOpen && (
        <AddNewGatewayModal
          handleCloseGatewayDetails={handleCloseGatewayDetails}
          fetchGateways={fetchGateways}
        />
      )}
    </>
  );
}
