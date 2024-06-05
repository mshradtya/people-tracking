// import { useState, useEffect } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { useFetchBeaconUsers } from "@/hooks/useFetchBeaconUsers";
// import { useFetchBeacons } from "@/hooks/useFetchBeacons";
// import { useSnackbar } from "@/hooks/useSnackbar";
// import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";

// const AssignUser = ({
//   openAssignUser,
//   handleCloseAssignUser,
//   selectedBeacon,
// }) => {
//   const axiosPrivate = useAxiosPrivate();
//   const { showSnackbar } = useSnackbar();
//   const { beaconUsers, fetchBeaconUsers } = useFetchBeaconUsers();
//   const { fetchBeacons } = useFetchBeacons();
//   const [selectedUser, setSelectedUser] = useState("none");

//   useEffect(() => {
//     fetchBeaconUsers();
//   }, []);

//   const handleUserSelect = (event) => {
//     setSelectedUser(event.target.value);
//   };

//   const handleSubmitAssignUser = async () => {
//     try {
//       const response = await axiosPrivate.post(`/beacon/user/assign`, {
//         bnid: selectedBeacon.bnid,
//         username: selectedUser,
//       });

//       if (response && response.data && response.data.status === 200) {
//         fetchBeacons();
//         handleCloseAssignUser();
//         showSnackbar("success", "User Assigned successfully");
//       } else {
//         // Handle unexpected response structure or status
//         showSnackbar("error", "Unexpected response from the server.");
//       }
//     } catch (error) {
//       // Handle errors, including cases where the response is undefined
//       showSnackbar(
//         "error",
//         error?.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   return (
//     <Modal
//       open={openAssignUser}
//       onClose={handleCloseAssignUser}
//       aria-labelledby="assign-user-modal-title"
//       aria-describedby="assign-user-modal-description"
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           bgcolor: "white",
//           boxShadow: 20,
//           p: 3,
//           minWidth: 400,
//           maxWidth: 600,
//         }}
//       >
//         <Typography variant="h6" component="h2" gutterBottom>
//           Assign User To Beacon {selectedBeacon?.bnid}
//         </Typography>
//         <FormControl fullWidth>
//           <InputLabel>Username:</InputLabel>
//           <Select value={selectedUser} onChange={handleUserSelect}>
//             <MenuItem value="none" disabled>
//               Select User
//             </MenuItem>
//             {beaconUsers.map((user) => (
//               <MenuItem key={user.id} value={user.username}>
//                 {user.username}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
//           <Button
//             onClick={handleCloseAssignUser}
//             color="primary"
//             variant="contained"
//             sx={{ mr: 2 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmitAssignUser}
//             color="primary"
//             variant="contained"
//           >
//             Submit
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default AssignUser;

import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import { useSnackbar } from "@/hooks/useSnackbar";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import TextField from "@mui/material/TextField";

const AssignUser = ({
  openAssignUser,
  handleCloseAssignUser,
  selectedBeacon,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const { fetchBeacons } = useFetchBeacons();
  const [username, setUsername] = useState("");

  const handleSubmitAssignUser = async () => {
    try {
      const response = await axiosPrivate.post(`/beacon/user/assign`, {
        bnid: selectedBeacon.bnid,
        username,
      });

      if (response && response.data && response.data.status === 200) {
        fetchBeacons();
        handleCloseAssignUser();
        showSnackbar("success", "User Updated successfully");
        setUsername("");
      } else {
        // Handle unexpected response structure or status
        showSnackbar("error", "Unexpected response from the server.");
      }
    } catch (error) {
      // Handle errors, including cases where the response is undefined
      showSnackbar(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key press
      handleSubmitAssignUser();
    }
  };

  useEffect(() => {
    const handleDocumentKeyPress = (event) => {
      if (event.key === "Enter") {
        handleSubmitAssignUser();
      }
    };

    if (openAssignUser) {
      document.addEventListener("keydown", handleDocumentKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyPress);
    };
  }, [openAssignUser]);

  return (
    <Modal open={openAssignUser} onClose={handleCloseAssignUser}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 20,
          p: 3,
          minWidth: 400,
          maxWidth: 600,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ mb: "10px" }}
        >
          Beacon {selectedBeacon?.bnid} - User Assignment
        </Typography>

        <Box component="form" autoComplete="on">
          <TextField
            fullWidth
            label="Username"
            variant="filled"
            value={username}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleSubmitAssignUser}
            color="primary"
            variant="contained"
          >
            Assign
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignUser;
