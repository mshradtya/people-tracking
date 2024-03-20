import * as React from "react";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useMap from "@/hooks/useMap";

export default function AddConnectPoint() {
  const { addingConnectPoint, setAddingConnectPoint } = useMap();

  const handleClick = () => {
    setAddingConnectPoint((prev) => !prev);
  };

  return (
    <Button
      variant="outlined"
      onClick={handleClick}
      startIcon={
        addingConnectPoint ? <CheckCircleIcon /> : <AddCircleRoundedIcon />
      }
      color={addingConnectPoint ? "success" : "primary"}
    >
      {addingConnectPoint ? "Stop Adding Connect Point" : "Add Connect Point"}
    </Button>
  );
}
