import { useState, useEffect } from "react";
import UsersTable from "./UsersTable";
import AddNewUserModal from "./modals/AddNewUserModal";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useSnackbar } from "../../hooks/useSnackbar";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

export default function Users() {
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState(1);
  const [users, setUsers] = useState([]);

  // Fetch devices from the server
  const fetchUsers = async () => {
    try {
      const response = await axiosPrivate.get("/users");
      console.log(response.data);
      setUsers(response.data.users);
      setIsLoading(false);
      setSerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      // navigate("/login", { state: location, replace: true });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          Add User
        </Button>
      </div>
      <UsersTable
        users={users}
        fetchUsers={fetchUsers}
        isLoading={isLoading}
        serialNumber={serialNumber}
      />
      {isUserDetailsOpen && (
        <AddNewUserModal
          handleCloseUserDetails={handleCloseUserDetails}
          fetchUsers={fetchUsers}
        />
      )}
    </>
  );
}
