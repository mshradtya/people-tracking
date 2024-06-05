import React from "react";
import { TextField, MenuItem } from "@mui/material";

const PathLogsOptions = ({ onDateChange }) => {
  const handleDateChange = (event) => {
    console.log("this ran");
    onDateChange(event.target.value);
  };

  return (
    <div
      style={{
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
    </div>
  );
};

export default PathLogsOptions;
