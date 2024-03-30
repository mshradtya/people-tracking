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

const ConnectPointROIModal = ({ connectPoints, onSubmit, onClose }) => {
  // Filter gatewayIds based on the condition
  const filteredConnectPoints = connectPoints.filter(
    (connectPoint) => connectPoint.roiCoords.length === 0
  );

  const [selectedConnectPointId, setSelectedConnectPointId] =
    React.useState(null);

  const handleConnectPointSelect = (event) => {
    setSelectedConnectPointId(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedConnectPointId);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Select Connect Point ID</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="gatewayId">Connect Point ID:</InputLabel>
          <Select
            id="connectPointId"
            value={selectedConnectPointId}
            onChange={handleConnectPointSelect}
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
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!selectedConnectPointId}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectPointROIModal;
