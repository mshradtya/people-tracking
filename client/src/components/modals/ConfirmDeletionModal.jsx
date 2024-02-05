import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmDeletionModal = ({ open, handleClose, handleConfirmDelete }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>Are you sure you want to delete this user?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="error"
          variant="outlined"
          onClick={() => handleConfirmDelete()}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeletionModal;
