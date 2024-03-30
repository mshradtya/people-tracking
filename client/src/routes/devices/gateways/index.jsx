import { useState, useEffect } from "react";
import GatewaysTable from "./GatewaysTable";
import RegisterGateway from "./modals/RegisterGateway";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useAuth from "@/hooks/auth/useAuth";

export default function Gateways() {
  const { auth } = useAuth();
  const isSuperAdmin = auth.role === "SuperAdmin";
  const [isGatewayDetailsOpen, setIsGatewayDetailsOpen] = useState(false);

  const handleRegisterGateway = () => {
    setIsGatewayDetailsOpen(true);
  };

  const handleCloseGatewayDetails = () => {
    setIsGatewayDetailsOpen(false);
  };

  return (
    <>
      {isSuperAdmin && (
        <div className="flex flex-row-reverse items-center w-full mb-4">
          <Button
            variant="outlined"
            startIcon={<AddCircleRoundedIcon />}
            onClick={handleRegisterGateway}
          >
            Register Gateway
          </Button>
        </div>
      )}
      <GatewaysTable />
      {isGatewayDetailsOpen && (
        <RegisterGateway
          handleCloseGatewayDetails={handleCloseGatewayDetails}
        />
      )}
    </>
  );
}
