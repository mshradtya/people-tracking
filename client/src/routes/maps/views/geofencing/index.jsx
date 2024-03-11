import { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import { Stage, Layer, Image, Line } from "react-konva";
import GatewayIndicator from "./GatewayIndicator";
import useAxiosPrivate from "../../../../hooks/auth/useAxiosPrivate";
import { useSnackbar } from "../../../../hooks/useSnackbar";

import GatewayModal from "./GatewayModal";

function calculateCanvasMeasures() {
  const maxWidth = window.innerWidth - 550;
  const maxHeight = window.innerHeight - 120;
  const aspectRatio = maxWidth / maxHeight;
  let width, height;
  if (aspectRatio > 1) {
    // Landscape mode
    width = maxHeight * aspectRatio;
    height = maxHeight;
  } else {
    // Portrait mode
    width = maxWidth;
    height = maxWidth / aspectRatio;
  }
  return { width, height };
}
function GeoFencing() {
  const { mapName, addingGateways } = useMap();
  const { showSnackbar } = useSnackbar();
  const [image, setImage] = useState(null);
  const [allGateways, setAllGateways] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 0,
    height: 0,
  });
  const [clickedGatewayCoordinates, setClickedGatewayCoordinates] = useState(
    []
  );
  const [gatewaysWithSOS, setGatewaysWithSOS] = useState([]);

  const fetchGateways = async () => {
    try {
      const response = await axiosPrivate.get("/gateways");
      setAllGateways(response.data.gateways);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      // navigate("/login", { state: location, replace: true });
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  useEffect(() => {
    const fetchGatewaysWithSOSInterval = setInterval(fetchGatewaysWithSOS, 500);

    return () => {
      clearInterval(fetchGatewaysWithSOSInterval);
    };
  }, []);

  // Fetch devices from the server
  const fetchGatewaysWithSOS = async () => {
    try {
      const response = await axiosPrivate.get("/gateway/sos");
      setGatewaysWithSOS(response.data.gateways);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  useEffect(() => {
    const { width, height } = calculateCanvasMeasures();
    setCanvasMeasures({ width, height });

    const imageToLoad = new window.Image();
    imageToLoad.src = `${mapName}.jpg`;
    imageToLoad.width = width;
    imageToLoad.height = height;
    imageToLoad.onload = () => {
      setImage(imageToLoad);
    };

    return () => {
      // Clean up
      imageToLoad.onload = null;
    };
  }, [mapName, window.innerWidth, window.innerHeight]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = useState(null);
  const [clickedPoint, setClickedPoint] = useState(null);

  const openModal = (point) => {
    setClickedPoint(point);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGatewayId(null);
  };

  const handleGatewaySelect = (event) => {
    setSelectedGatewayId(event.target.value);
  };

  const handleModalSubmit = async () => {
    if (selectedGatewayId && clickedPoint) {
      try {
        // Send a POST request to update gateway coordinates
        await axiosPrivate.post("/gateway/update/coords", {
          gwid: selectedGatewayId,
          coords: {
            x: clickedPoint.x,
            y: clickedPoint.y,
          },
        });

        // Add the selected gateway indicator on the map
        setClickedGatewayCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          {
            x: clickedPoint.x,
            y: clickedPoint.y,
            gatewayId: selectedGatewayId,
          },
        ]);

        closeModal();
        fetchGateways();
      } catch (error) {
        showSnackbar("error", "Failed to update gateway coordinates");
        console.error("Error updating gateway coordinates:", error);
      }
    } else {
      showSnackbar("error", "Please select a gateway ID");
    }
  };

  const handleAddGateways = (event) => {
    const container = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - container.left).toFixed(2);
    const y = (event.clientY - container.top).toFixed(2);

    openModal({ x, y });
  };

  const removeGatewayFromMap = async (gatewayId) => {
    try {
      // Send a POST request to update gateway coordinates to null
      await axiosPrivate.post("/gateway/update/coords", {
        gwid: gatewayId,
        coords: {
          x: null,
          y: null,
        },
      });

      // Remove the gateway indicator from the map
      setAllGateways((prevGateways) =>
        prevGateways.filter((gateway) => gateway.gwid !== gatewayId)
      );

      setClickedGatewayCoordinates((prevGateways) =>
        prevGateways.filter((gateway) => gateway.gatewayId !== gatewayId)
      );

      fetchGateways();
    } catch (error) {
      showSnackbar("error", "Failed to update gateway coordinates");
      console.error("Error updating gateway coordinates:", error);
    }
  };

  return (
    <div>
      <div
        onClick={addingGateways ? handleAddGateways : () => {}}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "20px",
        }}
      >
        <div
          className="rounded-lg border-2 relative"
          style={{
            boxShadow:
              "-1px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
          }}
        >
          <Stage width={canvasMeasures.width} height={canvasMeasures.height}>
            <Layer>
              <Image image={image} />
              {/* Dummy path */}
              {/* <Line
                points={[150, 120, 150, 460, 400, 460, 400, 200, 600, 200]}
                stroke="green"
                strokeWidth={4}
              /> */}
            </Layer>
          </Stage>
          {allGateways.map(
            (gateway, index) =>
              gateway.coords.x !== null && (
                <GatewayIndicator
                  index={index}
                  data={{
                    x: gateway.coords.x,
                    y: gateway.coords.y,
                    gatewayId: gateway.gwid,
                  }}
                  removeGatewayFromMap={removeGatewayFromMap}
                  gatewaysWithSOS={gatewaysWithSOS}
                />
              )
          )}

          {clickedGatewayCoordinates.map((data, index) => (
            <GatewayIndicator
              index={index}
              data={data}
              removeGatewayFromMap={removeGatewayFromMap}
              gatewaysWithSOS={gatewaysWithSOS}
            />
          ))}
        </div>
      </div>
      {isModalOpen && (
        <GatewayModal
          allGateways={allGateways}
          selectedGatewayId={selectedGatewayId}
          onGatewaySelect={handleGatewaySelect}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default GeoFencing;
