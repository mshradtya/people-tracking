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

const GatewayModal = ({
  allGateways,
  selectedGatewayId,
  onGatewaySelect,
  onSubmit,
  onClose,
}) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Select Gateway ID</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="gatewayId">Gateway ID:</InputLabel>
          <Select
            id="gatewayId"
            value={selectedGatewayId}
            onChange={onGatewaySelect}
          >
            <MenuItem value="" disabled>
              Select Gateway ID
            </MenuItem>
            {allGateways
              .filter(
                (gateway) =>
                  gateway.coords.x === null && gateway.coords.y === null
              )
              .map((gateway) => (
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
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GatewayModal;
