import React, { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import Tooltip from "@mui/material/Tooltip";

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

  // Generate a random x and y value within the bounding box
  const randomX = minX + Math.random() * (maxX - minX);
  const randomY = minY + Math.random() * (maxY - minY);

  return { x: randomX, y: randomY };
}

const BeaconIndicator = ({ index, beacon }) => {
  const { scale } = useMap();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    setX(getRandomPoint(beacon.boundingBox).x);
    setY(getRandomPoint(beacon.boundingBox).y);
  }, [beacon]);

  return (
    <div
      key={index}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: "20px",
        height: "20px",
        borderRadius: "20%",
        backgroundColor: "green",
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
          fontSize: "12px",
        }}
      >
        B
      </span>
    </div>
  );
};

export default BeaconIndicator;
