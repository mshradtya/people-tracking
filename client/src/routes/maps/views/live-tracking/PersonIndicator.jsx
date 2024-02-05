import React, { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function PersonIndicator({ circlePosition, showAlert }) {
  const [blinking, setBlinking] = useState(false);
  const [index, setIndex] = useState(-2);
  const alerts = [
    "SOS",
    "Fall Detection",
    "Abnormal Body Temperature",
    "Abnormal Heart Beat",
    "Unusual Idleness Detected",
  ];

  useEffect(() => {
    let interval;

    if (showAlert) {
      // Start blinking when showAlert is true
      interval = setInterval(() => {
        setBlinking((prevBlinking) => !prevBlinking);
      }, 300);
    } else {
      // Stop blinking when showAlert is false
      setBlinking(false);
      setIndex((prev) => prev + 1);
    }

    return () => clearInterval(interval);
  }, [showAlert]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${circlePosition.x}px`,
        top: `${circlePosition.y}px`,
        width: "30px",
        height: "30px",
        background: showAlert ? (blinking ? "red" : "white") : "green",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "left 0.5s ease-out, top 0.5s ease-out, background 0.5s ease-out",
        borderRadius: "20px",
      }}
    >
      {showAlert && (
        <div style={{ position: "absolute", bottom: 40 }}>
          <Alert variant="filled" severity="error">
            {alerts[index]}
          </Alert>
        </div>
      )}
      <Tooltip title="ID: 202">
        <PersonIcon
          style={{ color: showAlert ? (blinking ? "white" : "red") : "white" }}
        />
      </Tooltip>
    </div>
  );
}
