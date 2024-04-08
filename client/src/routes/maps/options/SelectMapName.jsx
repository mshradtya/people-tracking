import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useMap from "@/hooks/useMap";

export default function SelectMapName() {
  const { mapName, setMapName } = useMap();

  const handleChange = (event) => {
    setMapName(event.target.value);
  };

  return (
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
            width: "150px",
          }}
        >
          <InputLabel>Department</InputLabel>
          <Select
            value={mapName}
            label="Layout"
            onChange={handleChange}
            sx={{
              background: "white",
              boxShadow:
                "-1px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
            }}
          >
            <MenuItem value={"map1"}>Coke Oven 3</MenuItem>
            {/* <MenuItem value={"map2"}>Layout 2</MenuItem>
            <MenuItem value={"map3"}>Layout 3</MenuItem> */}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
