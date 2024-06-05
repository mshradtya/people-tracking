import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";

export default function BeaconDcsDialog({
  dcsAlertOpen,
  handleDcsAlertClose,
  beacon,
}) {
  const [remainingTime, setRemainingTime] = useState(30);

  useEffect(() => {
    if (dcsAlertOpen) {
      setRemainingTime(30); // Reset timer
      const timer = setTimeout(() => {
        handleDcsAlertClose(beacon?.bnid);
      }, 30000); // 30 seconds

      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [dcsAlertOpen]);

  return (
    <>
      <Dialog open={dcsAlertOpen}>
        <DialogTitle>{"Beacon Health Check"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "25px" }}>
            Beacon ID:{" "}
            <span style={{ fontWeight: "bold", color: "green" }}>
              {beacon?.bnid}
            </span>
            <br />
            Battery:{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  beacon?.battery > 50
                    ? "green"
                    : beacon?.battery > 30
                    ? "orange"
                    : "red",
              }}
            >
              {beacon?.battery}%
            </span>
            <br />
            SOS:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: beacon?.sos === "H" ? "green" : "",
              }}
            >
              {beacon?.sos === "H" ? "WORKING" : "OFF"}
            </span>
            <br />
            Username:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: beacon?.username ? "red" : "green",
              }}
            >
              {beacon?.username ? beacon?.username : "--"}
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box
            component="span"
            sx={{
              position: "absolute",
              bottom: 15,
              left: 22,
              fontSize: "16px",
              color: "gray",
            }}
          >
            Closing in {remainingTime}s
          </Box>
          <Button onClick={() => handleDcsAlertClose(beacon?.bnid)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
