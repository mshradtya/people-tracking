import React from "react";
import { TextField, MenuItem } from "@mui/material";

const SosHistoryOptions = ({ onDateChange }) => {
  const handleDateChange = (event) => {
    console.log("this ran");
    onDateChange(event.target.value);
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
        id="outlined-select-currency"
        select
        label="Select"
        defaultValue="fullDay"
      >
        <MenuItem value="fullDay">Full Day</MenuItem>
        <MenuItem value="option1">Shift A</MenuItem>
        <MenuItem value="option2">Shift B</MenuItem>
        <MenuItem value="option3">Shift C</MenuItem>
      </TextField>
    </div>
  );
};

export default SosHistoryOptions;
