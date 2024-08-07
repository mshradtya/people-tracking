// import React, { useState, useEffect } from "react";
// import RegisterBeacon from "./RegisterBeacon";
// import RegisterBeaconUser from "./RegisterBeaconUser";
// import BeaconsTable from "./BeaconsTable";
// import BeaconUsersTable from "./BeaconUsersTable";
// import Button from "@mui/material/Button";
// import PropTypes from "prop-types";
// import Box from "@mui/material/Box";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
// import useAuth from "@/hooks/auth/useAuth";

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// export default function Beacons() {
//   const { auth } = useAuth();
//   const isSuperAdmin = auth.role === "SuperAdmin";
//   const [isBeaconDetailsOpen, setIsBeaconDetailsOpen] = useState(false);
//   const [isBeaconUserDetailsOpen, setIsBeaconUserDetailsOpen] = useState(false);
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleRegisterBeacon = () => {
//     setIsBeaconDetailsOpen(true);
//   };

//   const handleRegisterBeaconUser = () => {
//     setIsBeaconUserDetailsOpen(true);
//   };

//   const handleCloseBeaconDetails = () => {
//     setIsBeaconDetailsOpen(false);
//   };

//   const handleCloseBeaconUserDetails = () => {
//     setIsBeaconUserDetailsOpen(false);
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center w-full mb-4">
//         <Tabs value={value} onChange={handleChange} centered>
//           <Tab label="Default" {...a11yProps(0)} />
//           {/* <Tab label="Usage" {...a11yProps(1)} /> */}
//           <Tab label="Users" {...a11yProps(1)} />
//         </Tabs>
//         {value === 0 && isSuperAdmin ? (
//           <Button
//             variant="outlined"
//             startIcon={<AddCircleRoundedIcon />}
//             onClick={handleRegisterBeacon}
//           >
//             Register Beacon
//           </Button>
//         ) : value === 1 && isSuperAdmin ? (
//           <Button
//             variant="outlined"
//             startIcon={<AddCircleRoundedIcon />}
//             onClick={handleRegisterBeaconUser}
//           >
//             Register User
//           </Button>
//         ) : (
//           <></>
//         )}
//       </div>

//       <CustomTabPanel value={value} index={0}>
//         <BeaconsTable />
//       </CustomTabPanel>
//       {/* <CustomTabPanel value={value} index={1}></CustomTabPanel> */}
//       <CustomTabPanel value={value} index={1}>
//         <BeaconUsersTable />
//       </CustomTabPanel>
//       {isBeaconDetailsOpen && (
//         <RegisterBeacon handleCloseBeaconDetails={handleCloseBeaconDetails} />
//       )}
//       {isBeaconUserDetailsOpen && (
//         <RegisterBeaconUser
//           handleCloseBeaconUserDetails={handleCloseBeaconUserDetails}
//         />
//       )}
//     </>
//   );
// }

import { useState } from "react";
import BeaconsTable from "./BeaconsTable";
import RegisterBeacon from "./RegisterBeacon";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import useAuth from "@/hooks/auth/useAuth";

export default function Beacons() {
  const { auth } = useAuth();
  const isSuperAdmin = auth.role === "SuperAdmin";
  const [isBeaconDetailsOpen, setIsBeaconDetailsOpen] = useState(false);

  const handleRegisterBeacon = () => {
    setIsBeaconDetailsOpen(true);
  };

  const handleCloseBeaconDetails = () => {
    setIsBeaconDetailsOpen(false);
  };

  return (
    <>
      {isSuperAdmin && (
        <div className="flex flex-row-reverse items-center w-full mb-4 mt-[-60px]">
          <Button
            variant="outlined"
            startIcon={<AddCircleRoundedIcon />}
            onClick={handleRegisterBeacon}
          >
            Register Beacon
          </Button>
        </div>
      )}
      <BeaconsTable />
      {isBeaconDetailsOpen && (
        <RegisterBeacon handleCloseBeaconDetails={handleCloseBeaconDetails} />
      )}
    </>
  );
}
