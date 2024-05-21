import React, { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import Tooltip from "@mui/material/Tooltip";
import { getMinutesDifference } from "@/utils/helpers";

const ConnectPointIndicator = ({
  index,
  data,
  removeConnectPointFromMap,
  // connectPointsWithSOS,
}) => {
  const { scale } = useMap();

  const handleDoubleClick = (event) => {
    event.preventDefault();
    removeConnectPointFromMap(data.connectPointId);
  };

  // const isSosConnectPoint = connectPointsWithSOS.includes(data.connectPointId);
  const formattedPillarStart = data.pillarStart.toString().padStart(2, "0");
  const formattedPillarEnd = data.pillarEnd.toString().padStart(2, "0");
  const timeDifference = data.timestamp
    ? getMinutesDifference(data.timestamp)
    : null;

  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: `${data.x - 25}px`,
          top: `${data.connectPointId < 109 ? data.y + 30 : data.y - 40}px`,
          // backgroundColor: "purple",
          borderRadius: "20%",
          color: "black",
          padding: "2px",
          // boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
          // transform: `scale(${1 / scale})`,
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {`${formattedPillarStart} - ${formattedPillarEnd}`}
      </div>
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
            // backgroundColor: isSosConnectPoint ? "red" : "purple",
            backgroundColor:
              timeDifference === null
                ? "purple"
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
            C
          </span>
        </div>
      </Tooltip>
    </div>
  );
};

export default ConnectPointIndicator;
