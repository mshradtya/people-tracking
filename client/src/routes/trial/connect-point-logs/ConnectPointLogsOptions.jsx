import React from "react";
import { TextField, MenuItem } from "@mui/material";

const ConnectPointLogsOptions = ({ onDateChange }) => {
  const handleDateChange = (event) => {
    console.log("this ran");
    onDateChange(event.target.value);
  };

  return (
    <div
      style={{
        marginTop: "-65px",
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

export default ConnectPointLogsOptions;
