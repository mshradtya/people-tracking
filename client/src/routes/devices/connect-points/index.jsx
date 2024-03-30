import { useState } from "react";
import ConnectPointsTable from "./ConnectPointsTable";
import RegisterConnectPoint from "./modals/RegisterConnectPoint";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useAuth from "@/hooks/auth/useAuth";

export default function ConnectPoints() {
  const { auth } = useAuth();
  const isSuperAdmin = auth.role === "SuperAdmin";
  const [isGatewayDetailsOpen, setIsGatewayDetailsOpen] = useState(false);

  const handleRegisterGateway = () => {
    setIsGatewayDetailsOpen(true);
  };

  const handleCloseConnectPointDetails = () => {
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
            Register Connect Point
          </Button>
        </div>
      )}
      <ConnectPointsTable />
      {isGatewayDetailsOpen && (
        <RegisterConnectPoint
          handleCloseConnectPointDetails={handleCloseConnectPointDetails}
        />
      )}
    </>
  );
}
