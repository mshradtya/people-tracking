import { useState, useEffect } from "react";
import GatewaysTable from "./GatewaysTable";
import AddNewGatewayModal from "@/components/modals/AddNewGatewayModal";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import axios from "axios";

export default function Gateways() {
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = () => {
    axios
      .get("/api/users")
      .then((res) => {
        setUsersData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddUserClick = () => {
    setIsUserDetailsOpen(true);
  };

  const handleCloseUserDetails = () => {
    setIsUserDetailsOpen(false);
  };

  return (
    <>
      <div className="flex flex-row-reverse items-center w-full mb-4">
        <Button
          variant="outlined"
          startIcon={<AddCircleRoundedIcon />}
          onClick={handleAddUserClick}
        >
          Add Gateway
        </Button>
      </div>
      <GatewaysTable usersData={usersData} getUsersData={getUsersData} />
      {isUserDetailsOpen && (
        <AddNewGatewayModal
          handleCloseUserDetails={handleCloseUserDetails}
          getUsersData={getUsersData}
        />
      )}
    </>
  );
}
