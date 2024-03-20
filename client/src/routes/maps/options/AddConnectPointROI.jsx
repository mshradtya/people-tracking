import * as React from "react";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useMap from "@/hooks/useMap";

export default function AddConnectPointROI() {
  const { addingConnectPointROI, setAddingConnectPointROI } = useMap();

  const handleClick = () => {
    setAddingConnectPointROI((prev) => !prev);
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      startIcon={
        addingConnectPointROI ? <CheckCircleIcon /> : <AddCircleRoundedIcon />
      }
      color={addingConnectPointROI ? "success" : "primary"}
    >
      {addingConnectPointROI ? "Stop Adding ROI" : "Add Connect Point ROI"}
    </Button>
  );
}
