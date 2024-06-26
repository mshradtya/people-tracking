import React from "react";
import { TextField, MenuItem } from "@mui/material";

const SosHistoryOptions = ({ onDateChange, onShiftChange }) => {
  const handleDateChange = (event) => {
    onDateChange(event.target.value);
  };

  const handleShiftChange = (event) => {
    onShiftChange(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
      }}
    >
      <TextField
        id="date"
        label="Date"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleDateChange}
      />
      <TextField
        select
        label="Select Shift"
        defaultValue=""
        onChange={handleShiftChange}
        sx={{ width: "130px" }}
      >
        <MenuItem value="fullDay">Full Day</MenuItem>
        <MenuItem value="shiftA">Shift A</MenuItem>
        <MenuItem value="shiftB">Shift B</MenuItem>
        <MenuItem value="shiftC">Shift C</MenuItem>
      </TextField>
    </div>
  );
};

export default SosHistoryOptions;
