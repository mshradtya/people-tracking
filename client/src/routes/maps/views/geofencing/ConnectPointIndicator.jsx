import React, { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import Tooltip from "@mui/material/Tooltip";

const ConnectPointIndicator = ({
  index,
  data,
  removeConnectPointFromMap,
  connectPointsWithSOS,
}) => {
  const { scale } = useMap();
  const [isBlinking, setBlinking] = useState(true);

  const handleDoubleClick = (event) => {
    event.preventDefault();
    removeConnectPointFromMap(data.connectPointId);
  };

  const isSosConnectPoint = connectPointsWithSOS.includes(data.connectPointId);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Tooltip
      title={`Connect Point ID: ${data.connectPointId}`}
      placement="top"
      arrow
    >
      <div
        onContextMenu={handleDoubleClick}
        key={index}
        style={{
          position: "absolute",
          left: `${data.x}px`,
          top: `${data.y}px`,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: isSosConnectPoint
            ? isBlinking
              ? "red"
              : "white"
            : "#DA0037",
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
            color: isSosConnectPoint ? (isBlinking ? "white" : "red") : "",
          }}
        >
          C
        </span>
      </div>
    </Tooltip>
  );
};

export default ConnectPointIndicator;
