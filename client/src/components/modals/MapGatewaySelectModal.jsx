import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const MapGatewaySelectModal = ({ isOpen, onClose, onSubmit, gatewayIds }) => {
  const [selectedGatewayId, setSelectedGatewayId] = useState("");

  const handleSubmit = () => {
    onSubmit(selectedGatewayId);
    setSelectedGatewayId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select ID</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Gateway ID"
          value={selectedGatewayId}
          onChange={(e) => setSelectedGatewayId(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select a gateway ID</MenuItem>
          {gatewayIds.map((gateway) => (
            <MenuItem key={gateway._id} value={gateway._id}>
              {gateway.gwid}
            </MenuItem>
          ))}
        </TextField>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onClose}
            color="inherit"
            variant="outlined"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedGatewayId}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapGatewaySelectModal;
