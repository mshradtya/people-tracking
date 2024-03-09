import { useState, useEffect } from "react";
import AddNewWearableModal from "@/components/modals/AddNewWearableModal";
import BeaconsTable from "./BeaconsTable";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import axios from "axios";

export default function Beacons() {
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
          Register Beacon
        </Button>
      </div>
      <BeaconsTable usersData={usersData} getUsersData={getUsersData} />
      {isUserDetailsOpen && (
        <AddNewWearableModal
          handleCloseUserDetails={handleCloseUserDetails}
          getUsersData={getUsersData}
        />
      )}
    </>
  );
}
