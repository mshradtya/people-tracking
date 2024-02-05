import React, { useState, useEffect } from "react";
import PersonIndicator from "./PersonIndicator";
import RepeaterIndicator from "./RepeaterIndicator";
import GatewayIndicator from "./GatewayIndicator";
import useMap from "@/hooks/useMap";

export default function LiveTracking() {
  const { mapName, addingRepeaters, addingGateways } = useMap();
  const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
  const [showAlert, setShowAlert] = useState(false);
  const [clickedRepeaterCoordinates, setClickedRepeaterCoordinates] = useState(
    []
  );
  const [clickedGatewayCoordinates, setClickedGatewayCoordinates] = useState(
    []
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!showAlert) {
        const newX = Math.random() * 500;
        const newY = Math.random() * 500;
        setCirclePosition({ x: newX, y: newY });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showAlert]);

  useEffect(() => {
    const alertInterval = setInterval(() => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Alert will be shown for 3 seconds
    }, 7000); // Repeat every 8 seconds

    return () => clearInterval(alertInterval);
  }, []);

  const handleAddRepeaters = (event) => {
    const container = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - container.left).toFixed(2);
    const y = (event.clientY - container.top).toFixed(2);

    // Add new coordinate to the list
    setClickedRepeaterCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      { x, y },
    ]);
  };

  const handleAddGateways = (event) => {
    const container = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - container.left).toFixed(2);
    const y = (event.clientY - container.top).toFixed(2);

    // Add new coordinate to the list
    setClickedGatewayCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      { x, y },
    ]);
  };

  return (
    <div
      onClick={
        addingRepeaters
          ? handleAddRepeaters
          : addingGateways
          ? handleAddGateways
          : ""
      }
      style={{ position: "relative" }}
    >
      <img
        src={`/${mapName}.jpg`}
        alt="test"
        className="rounded-lg h-[calc(100vh-120px)]"
      />

      <PersonIndicator circlePosition={circlePosition} showAlert={showAlert} />

      {clickedRepeaterCoordinates.map((coord, index) => (
        <RepeaterIndicator key={index} coord={coord} />
      ))}

      {clickedGatewayCoordinates.map((coord, index) => (
        <GatewayIndicator key={index} coord={coord} />
      ))}
    </div>
  );
}
