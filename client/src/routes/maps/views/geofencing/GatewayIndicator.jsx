import React, { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import Tooltip from "@mui/material/Tooltip";

const GatewayIndicator = ({
  index,
  data,
  removeGatewayFromMap,
  gatewaysWithSOS,
}) => {
  const { scale } = useMap();
  const [isBlinking, setBlinking] = useState(true);

  const handleDoubleClick = (event) => {
    event.preventDefault();
    removeGatewayFromMap(data.gatewayId);
  };

  const isSosGateway = gatewaysWithSOS.includes(data.gatewayId);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

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
          backgroundColor: isSosGateway
            ? isBlinking
              ? "red"
              : "white"
            : "blue",
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
            color: isSosGateway ? (isBlinking ? "white" : "red") : "",
          }}
        >
          G
        </span>
      </div>
    </Tooltip>
  );
};

export default GatewayIndicator;
