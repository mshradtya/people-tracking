import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function BeaconDcsDialog({
  dcsAlertOpen,
  handleDcsAlertClose,
  beacon,
}) {
  return (
    <>
      <Dialog open={dcsAlertOpen}>
        <DialogTitle>{"Beacon Health Check"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "25px" }}>
            Beacon ID: <span style={{ fontWeight: "bold" }}>{beacon.bnid}</span>
            <br />
            Battery:{" "}
            <span style={{ fontWeight: "bold" }}>{beacon.battery}%</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDcsAlertClose(beacon.bnid)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
