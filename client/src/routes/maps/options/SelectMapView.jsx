import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import useMap from "@/hooks/useMap";

export default function SelectMapView() {
  const { mapView, setMapView } = useMap();

  const handleChange = (event) => {
    setMapView(event.target.value);
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
          fullWidth
          sx={{
            width: "150px",
          }}
        >
          <InputLabel>View</InputLabel>
          <Select
            value={mapView}
            label="View"
            onChange={handleChange}
            sx={{
              background: "white",
              boxShadow:
                "-1px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
            }}
          >
            {/* <MenuItem value={"live-tracking"}>Live Tracking</MenuItem>
            <MenuItem value={"path-tracking"}>Path Tracking</MenuItem>
            <MenuItem value={"heatmap"}>Heatmap</MenuItem> */}
            <MenuItem value={"sos-alert"}>SOS Alert</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
