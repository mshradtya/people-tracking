import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Tooltip } from "@mui/material";
import useMap from "@/hooks/useMap";
import { Stage, Layer, Shape } from "react-konva";

export default function CombinedPathTracking() {
  const { mapName } = useMap();
  const indicatorsData = [
    { position: { x: 100, y: 100 }, color: "green" },
    { position: { x: 350, y: 200 }, color: "purple" },
    { position: { x: 450, y: 200 }, color: "blue" },
  ];

  const handleIndicatorClick = () => {
    window.alert("hello");
  };

  return (
    <>
      <div>
        <img
          src={`/${mapName}.jpg`}
          alt="test"
          className="rounded-lg h-[calc(100vh-120px)]"
        />
        {indicatorsData.map((data, index) => (
          <PathTrackingIndicator
            key={index}
            circlePosition={data.position}
            color={data.color}
            handleIndicatorClick={handleIndicatorClick}
          />
        ))}
      </div>
    </>
  );
}

function PathTrackingIndicator({
  circlePosition,
  color,
  handleIndicatorClick,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${circlePosition.x}px`,
        top: `${circlePosition.y}px`,
        width: "30px",
        height: "30px",
        background: `${color}`,
        color: "white",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "left 0.5s ease-out, top 0.5s ease-out, background 0.5s ease-out",
        borderRadius: "20px",
      }}
      onClick={handleIndicatorClick}
    >
      <Tooltip title="30 minutes">
        <PersonIcon />
      </Tooltip>
    </div>
  );
}
