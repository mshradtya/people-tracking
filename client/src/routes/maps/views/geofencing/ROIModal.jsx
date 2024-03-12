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

const ROIModal = ({ allGateways, onSubmit, onClose }) => {
  // Filter gatewayIds based on the condition
  const filteredGateways = allGateways.filter(
    (gateway) => gateway.roiCoords.length === 0
  );

  const [selectedGatewayId, setSelectedGatewayId] = React.useState(null);

  const handleGatewaySelect = (event) => {
    setSelectedGatewayId(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedGatewayId);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Select Gateway ID</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="gatewayId">Gateway ID:</InputLabel>
          <Select
            id="gatewayId"
            value={selectedGatewayId}
            onChange={handleGatewaySelect}
          >
            <MenuItem value="" disabled>
              Select Gateway ID
            </MenuItem>
            {filteredGateways.map((gateway) => (
              <MenuItem key={gateway._id} value={gateway.gwid}>
                {gateway.gwid}
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
          disabled={!selectedGatewayId}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ROIModal;
