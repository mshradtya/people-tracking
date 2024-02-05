import { useState, useEffect } from "react";
import RepeatersTable from "./RepeatersTable";
import AddNewRepeaterModal from "@/components/modals/AddNewRepeaterModal";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import axios from "axios";

export default function Repeaters() {
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
          Add Repeater
        </Button>
      </div>
      <RepeatersTable usersData={usersData} getUsersData={getUsersData} />
      {isUserDetailsOpen && (
        <AddNewRepeaterModal
          handleCloseUserDetails={handleCloseUserDetails}
          getUsersData={getUsersData}
        />
      )}
    </>
  );
}
