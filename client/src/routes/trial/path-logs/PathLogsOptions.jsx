import React from "react";
import { TextField, MenuItem } from "@mui/material";

const PathLogsOptions = ({ onDateChange, onBnidChange }) => {
  const handleDateChange = (event) => {
    onDateChange(event.target.value);
  };

  const handleBnidChange = (event) => {
    onBnidChange(event.target.value);
  };

  return (
    <div
      style={{
        marginTop: "-65px",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
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
        label="Select BNID"
        defaultValue=""
        onChange={handleBnidChange}
        sx={{ width: "130px" }}
      >
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="2">2</MenuItem>
        <MenuItem value="3">3</MenuItem>
        <MenuItem value="4">4</MenuItem>
      </TextField>
    </div>
  );
};

export default PathLogsOptions;
