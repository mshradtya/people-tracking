import * as React from "react";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useMap from "@/hooks/useMap";

export default function AddROI() {
  const { addingROI, setAddingROI } = useMap();

  const handleClick = () => {
    setAddingROI((prev) => !prev);
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      startIcon={addingROI ? <CheckCircleIcon /> : <AddCircleRoundedIcon />}
      color={addingROI ? "success" : "primary"}
    >
      {addingROI ? "Stop Adding ROI" : "Add ROI"}
    </Button>
  );
}
