import * as React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

export default function BasicSelect() {
  const [age, setAge] = React.useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="flex justify-between">
      <div>
        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FormControl
            sx={{
              width: "300px",
              background: "white",
              boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2)",
            }}
          >
            <InputLabel id="demo-simple-select-label">Floor</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>Floor 1</MenuItem>
              <MenuItem value={20}>Floor 2</MenuItem>
              <MenuItem value={30}>Floor 3</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div>
        {" "}
        <Button
          // disabled={disableButtons}
          variant="contained"
          startIcon={<AddIcon sx={{ color: "blue" }} />}
          sx={{
            background: "white",
            color: "blue",
            mr: "10px",
            "&:hover": {
              background: "inherit",
              // color: "white",
            },
            fontWeight: "bold",
          }}
        >
          Add Floor Layout
        </Button>
      </div>
    </div>
  );
}
