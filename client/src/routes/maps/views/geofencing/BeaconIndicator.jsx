import React, { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";

function getRandomPoint(coordinates) {
  // Validate input array length
  if (coordinates.length !== 8 || coordinates.length % 2 !== 0) {
    throw new Error(
      "Invalid input array. Expected an array of 8 coordinates (4 x-y pairs)."
    );
  }

  // Extract the minimum and maximum x and y values from the coordinates array
  const minX = Math.min(...coordinates.filter((_, index) => index % 2 === 0));
  const maxX = Math.max(...coordinates.filter((_, index) => index % 2 === 0));
  const minY = Math.min(...coordinates.filter((_, index) => index % 2 !== 0));
  const maxY = Math.max(...coordinates.filter((_, index) => index % 2 !== 0));

  // Adjust the bounding box to be 20 pixels smaller
  const adjustedMinX = minX + 25;
  const adjustedMaxX = maxX - 25;
  const adjustedMinY = minY + 25;
  const adjustedMaxY = maxY - 25;

  // Generate a random x and y value within the adjusted bounding box
  const randomX = adjustedMinX + Math.random() * (adjustedMaxX - adjustedMinX);
  const randomY = adjustedMinY + Math.random() * (adjustedMaxY - adjustedMinY);

  return { x: randomX, y: randomY };
}

function getRandomColor() {
  // Define a range of values for dark colors
  const minValue = 32; // Minimum value (inclusive)
  const maxValue = 128; // Maximum value (exclusive)

  // Generate random RGB values within the dark color range
  const r = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  const g = Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  const b = Math.floor(Math.random() * (maxValue - minValue)) + minValue;

  // Convert RGB values to a hexadecimal color code
  const hexColor =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");

  return hexColor;
}

const BeaconIndicator = ({
  index,
  beacon,
  prevBeaconPositions,
  setPrevBeaconPositions,
}) => {
  const { scale } = useMap();
  const [beaconColor, setBeaconColor] = useState("");
  const prevPosition = prevBeaconPositions[beacon.bnid] || { x: 0, y: 0 };
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setBeaconColor(getRandomColor());
  }, []);

  useEffect(() => {
    // Update position only if cpid is different from the previous value
    if (beacon.cpid !== prevPosition.cpid) {
      const randomPoint = getRandomPoint(beacon.boundingBox);
      setPrevBeaconPositions((prevPositions) => ({
        ...prevPositions,
        [beacon.bnid]: {
          x: randomPoint.x,
          y: randomPoint.y,
          cpid: beacon.cpid,
        },
      }));
    }
  }, [beacon]);

  return (
    <div
      key={index}
      style={{
        position: "absolute",
        left: `${prevPosition.x}px`,
        top: `${prevPosition.y}px`,
        width: "1.5em",
        height: "1.5em",
        borderRadius: "50%",
        backgroundColor:
          beacon.sos === "H" ? (isBlinking ? "red" : "white") : beaconColor,
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
        transform: `scale(${1 / scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        transition:
          "left 0.5s ease-out, top 0.5s ease-out, background 0.5s ease-out",
      }}
    >
      <span
        style={{
          color: beacon.sos === "H" ? (isBlinking ? "white" : "red") : "",
        }}
      >
        <Tooltip title={`${beacon.bnid}: ${beacon.username}`}>
          <PersonIcon />
        </Tooltip>
      </span>
    </div>
  );
};

export default BeaconIndicator;
