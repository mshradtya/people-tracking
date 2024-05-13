import React, { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import Tooltip from "@mui/material/Tooltip";
import { getMinutesDifference } from "@/utils/helpers";

const GatewayIndicator = ({ index, data, removeGatewayFromMap }) => {
  const { scale } = useMap();
  const timeDifference = data.timestamp
    ? getMinutesDifference(data.timestamp)
    : null;

  const handleDoubleClick = (event) => {
    event.preventDefault();
    removeGatewayFromMap(data.gatewayId);
  };

  return (
    <Tooltip title={`Gateway ID: ${data.gatewayId}`} placement="top" arrow>
      <div
        onContextMenu={handleDoubleClick}
        key={index}
        style={{
          position: "absolute",
          left: `${data.x}px`,
          top: `${data.y}px`,
          width: "20px",
          height: "20px",
          borderRadius: "20%",
          backgroundColor:
            timeDifference === null
              ? "blue"
              : timeDifference < 30
              ? "green"
              : "red",
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
          G
        </span>
      </div>
    </Tooltip>
  );
};

export default GatewayIndicator;
