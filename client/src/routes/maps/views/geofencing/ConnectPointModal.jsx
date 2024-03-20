import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const ConnectPointModal = ({
  allConnectPoints,
  selectedConnectPointId,
  onConnectPointSelect,
  onSubmit,
  onClose,
}) => {
  // Filter gatewayIds based on the condition
  const filteredConnectPoints = allConnectPoints.filter(
    (connectPoint) =>
      connectPoint.coords.x === null && connectPoint.coords.y === null
  );

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Select Connect Point ID</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="connectPointId">Connect Point ID:</InputLabel>
          <Select
            id="connectPointId"
            value={selectedConnectPointId}
            onChange={onConnectPointSelect}
          >
            <MenuItem value="" disabled>
              Select Connect Point ID
            </MenuItem>
            {filteredConnectPoints.map((connectPoint) => (
              <MenuItem key={connectPoint._id} value={connectPoint.cpid}>
                {connectPoint.cpid}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectPointModal;
