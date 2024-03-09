import { useState } from "react";
import useMap from "@/hooks/useMap";
import GatewayIndicator from "./GatewayIndicator";

function GeoFencing() {
  const { mapName, addingGateways } = useMap();
  const [clickedGatewayCoordinates, setClickedGatewayCoordinates] = useState(
    []
  );

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
      onClick={addingGateways ? handleAddGateways : ""}
      style={{ position: "relative" }}
    >
      <img
        src={`/${mapName}.jpg`}
        alt="test"
        className="rounded-lg h-[calc(100vh-120px)]"
      />

      {clickedGatewayCoordinates.map((coord, index) => (
        <GatewayIndicator key={index} coord={coord} />
      ))}
    </div>
  );
}

export default GeoFencing;
