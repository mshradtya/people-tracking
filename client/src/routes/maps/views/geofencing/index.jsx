import { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import { Stage, Layer, Image, Line } from "react-konva";
import GatewayIndicator from "./GatewayIndicator";
import ConnectPointIndicator from "./ConnectPointIndicator";
import useAxiosPrivate from "../../../../hooks/auth/useAxiosPrivate";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import ROIModal from "./ROIModal";
import ConnectPointROIModal from "./ConnectPointROIModal";

import GatewayModal from "./GatewayModal";
import ConnectPointModal from "./ConnectPointModal";
import useAudioPlayer from "../../../../hooks/useAudioPlayer";
import { useAlarmAlert } from "../../../../hooks/useAlarmAlert";

function calculateCanvasMeasures() {
  const maxWidth = window.innerWidth - 350;
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
  const {
    mapName,
    addingGateways,
    addingROI,
    addingConnectPoint,
    addingConnectPointROI,
  } = useMap();
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const { showAlarmAlert, setShowAlarmAlert } = useAlarmAlert();

  const [image, setImage] = useState(null);
  const [allGateways, setAllGateways] = useState([]);
  const [allConnectPoints, setAllConnectPoints] = useState([]);
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 0,
    height: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectPointModalOpen, setIsConnectPointModalOpen] = useState(false);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [gatewaysWithSOS, setGatewaysWithSOS] = useState([]);
  const [connectPointsWithSOS, setConnectPointsWithSOS] = useState([]);
  const [roiCoordinatesPerGateway, setRoiCoordinatesPerGateway] = useState({});
  const [roiCoordinatesPerConnectPoint, setRoiCoordinatesPerConnectPoint] =
    useState({});
  const [selectedGatewayId, setSelectedGatewayId] = useState(null);
  const [selectedConnectPointId, setSelectedConnectPointId] = useState(null);
  const [selectedGatewayIdForROI, setSelectedGatewayIdForROI] = useState(null);
  const [selectedConnectPointForROI, setSelectedConnectPointForROI] =
    useState(null);
  const [isROIModalOpen, setIsROIModalOpen] = useState(false);
  const [isConnectPointROIModalOpen, setIsConnectPointROIModalOpen] =
    useState(false);
  const [blink, setBlink] = useState(true);
  // const [audioTrigger, setAudioTrigger] = useState(false);
  // const isPlaying = useAudioPlayer("/alarm.mp3", audioTrigger);

  const fetchGateways = async () => {
    try {
      const response = await axiosPrivate.get("/gateways");
      setAllGateways(response.data.gateways);
      response.data.gateways.map((gateway) => {
        setRoiCoordinatesPerGateway((prev) => {
          return {
            ...prev,
            [gateway.gwid]: gateway.roiCoords,
          };
        });
      });
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  const fetchConnectPoints = async () => {
    try {
      const response = await axiosPrivate.get("/connect-points");
      setAllConnectPoints(response.data.connectPoints);
      response.data.connectPoints.map((connectPoint) => {
        setRoiCoordinatesPerConnectPoint((prev) => {
          return {
            ...prev,
            [connectPoint.cpid]: connectPoint.roiCoords,
          };
        });
      });
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  useEffect(() => {
    fetchGateways();
    fetchConnectPoints();
  }, []);

  useEffect(() => {
    const fetchGatewaysWithSOSInterval = setInterval(fetchGatewaysWithSOS, 500);
    const fetchConnectPointsWithSOSInterval = setInterval(
      fetchConnectPointsWithSOS,
      500
    );

    return () => {
      clearInterval(fetchGatewaysWithSOSInterval);
      clearInterval(fetchConnectPointsWithSOSInterval);
    };
  }, []);

  const fetchGatewaysWithSOS = async () => {
    try {
      const response = await axiosPrivate.get("/gateway/sos");
      setGatewaysWithSOS(response.data.gateways);
      if (response.data.gateways.length) {
        // setAudioTrigger(true);
        // setShowAlarmAlert(true);
      } else {
        // setAudioTrigger(false);
        // setShowAlarmAlert(false);
      }
      // console.log(response.data.gateways);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  const fetchConnectPointsWithSOS = async () => {
    try {
      const response = await axiosPrivate.get("/connect-point/sos");
      setConnectPointsWithSOS(response.data.connectPoints);
      // console.log(response.data.gateways);
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
      imageToLoad.onload = null;
    };
  }, [mapName, window.innerWidth, window.innerHeight]);

  const openModal = (point) => {
    setClickedPoint(point);
    setIsModalOpen(true);
  };

  const openConnectPointModal = (point) => {
    setClickedPoint(point);
    setIsConnectPointModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGatewayId(null);
  };

  const closeConnectPointModal = () => {
    setIsConnectPointModalOpen(false);
    setSelectedConnectPointId(null);
  };

  const handleGatewaySelect = (event) => {
    setSelectedGatewayId(event.target.value);
  };

  const handleConnectPointSelect = (event) => {
    setSelectedConnectPointId(event.target.value);
  };

  const handleModalSubmit = async () => {
    if (selectedGatewayId && clickedPoint) {
      try {
        await axiosPrivate.post("/gateway/update/coords", {
          gwid: selectedGatewayId,
          coords: {
            x: clickedPoint.x,
            y: clickedPoint.y,
          },
        });

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

  const handleConnectPointModalSubmit = async () => {
    if (selectedConnectPointId && clickedPoint) {
      try {
        await axiosPrivate.post("/connect-point/update/coords", {
          cpid: selectedConnectPointId,
          coords: {
            x: clickedPoint.x,
            y: clickedPoint.y,
          },
        });

        closeConnectPointModal();
        fetchConnectPoints();
      } catch (error) {
        showSnackbar("error", "Failed to update connect point coordinates");
        console.error("Error updating connect points coordinates:", error);
      }
    } else {
      showSnackbar("error", "Please select a connect point ID");
    }
  };

  const handleAddGateways = (event) => {
    const container = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - container.left).toFixed(2);
    const y = (event.clientY - container.top).toFixed(2);

    openModal({ x, y });
  };

  const handleAddConnectPoint = (event) => {
    const container = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - container.left).toFixed(2);
    const y = (event.clientY - container.top).toFixed(2);

    openConnectPointModal({ x, y });
  };

  const openROIModal = () => {
    setIsROIModalOpen(true);
  };

  const openConnectPointROIModal = () => {
    setIsConnectPointROIModalOpen(true);
  };

  const closeROIModal = () => {
    setIsROIModalOpen(false);
  };

  const closeConnectPointROIModal = () => {
    setIsConnectPointROIModalOpen(false);
  };

  const handleROIModalSubmit = (gatewayId) => {
    setSelectedGatewayIdForROI(gatewayId);
    closeROIModal();
  };

  const handleConnectPointROIModalSubmit = (connectPointId) => {
    setSelectedConnectPointForROI(connectPointId);
    closeConnectPointROIModal();
  };

  const handleAddROIClick = (event) => {
    if (!selectedGatewayIdForROI) {
      openROIModal();
      return;
    }

    const container = event.currentTarget.getBoundingClientRect();
    const x = +(event.clientX - container.left).toFixed(2);
    const y = +(event.clientY - container.top).toFixed(2);

    setRoiCoordinatesPerGateway((prevCoordinates) => {
      const gatewayCoordinates = prevCoordinates[selectedGatewayIdForROI] || [];

      return {
        ...prevCoordinates,
        [selectedGatewayIdForROI]: [...gatewayCoordinates, x, y],
      };
    });
  };

  const handleAddConnectPointROIClick = (event) => {
    if (!selectedConnectPointForROI) {
      openConnectPointROIModal();
      return;
    }

    const container = event.currentTarget.getBoundingClientRect();
    const x = +(event.clientX - container.left).toFixed(2);
    const y = +(event.clientY - container.top).toFixed(2);

    setRoiCoordinatesPerConnectPoint((prevCoordinates) => {
      const connectPointCoordinates =
        prevCoordinates[selectedConnectPointForROI] || [];

      return {
        ...prevCoordinates,
        [selectedConnectPointForROI]: [...connectPointCoordinates, x, y],
      };
    });
  };

  useEffect(() => {
    if (roiCoordinatesPerGateway[selectedGatewayIdForROI]?.length === 8) {
      // setAddingROI(false);
      updateROICoordinates(selectedGatewayIdForROI);
      setSelectedGatewayIdForROI(null);
      fetchGateways();
    }
  }, [roiCoordinatesPerGateway]);

  useEffect(() => {
    if (
      roiCoordinatesPerConnectPoint[selectedConnectPointForROI]?.length === 8
    ) {
      // setAddingROI(false);
      updateConnectPointROICoordinates(selectedConnectPointForROI);
      setSelectedConnectPointForROI(null);
      fetchConnectPoints();
    }
  }, [roiCoordinatesPerConnectPoint]);

  const updateROICoordinates = async (gatewayId) => {
    try {
      await axiosPrivate.post("/gateway/update/roiCoords", {
        gwid: gatewayId,
        roiCoords: roiCoordinatesPerGateway[gatewayId],
      });
      showSnackbar("success", "ROI added successfully");
    } catch (error) {
      showSnackbar("error", "Failed to update ROI coordinates");
      console.error("Error updating ROI coordinates:", error);
    }
  };

  const updateConnectPointROICoordinates = async (connectPointId) => {
    try {
      await axiosPrivate.post("/connect-point/update/roiCoords", {
        cpid: connectPointId,
        roiCoords: roiCoordinatesPerConnectPoint[connectPointId],
      });
      showSnackbar("success", "ROI added successfully");
    } catch (error) {
      showSnackbar("error", "Failed to update ROI coordinates");
      console.error("Error updating ROI coordinates:", error);
    }
  };

  const removeGatewayFromMap = async (gatewayId) => {
    try {
      await axiosPrivate.post("/gateway/update/coords", {
        gwid: gatewayId,
        coords: {
          x: null,
          y: null,
        },
      });

      fetchGateways();
    } catch (error) {
      showSnackbar("error", "Failed to update gateway coordinates");
      console.error("Error updating gateway coordinates:", error);
    }
  };

  const removeConnectPointFromMap = async (connectPointId) => {
    try {
      await axiosPrivate.post("/connect-point/update/coords", {
        cpid: connectPointId,
        coords: {
          x: null,
          y: null,
        },
      });

      fetchConnectPoints();
    } catch (error) {
      showSnackbar("error", "Failed to update gateway coordinates");
      console.error("Error updating gateway coordinates:", error);
    }
  };

  useEffect(() => {
    // Set up an interval to toggle the blinking effect
    const intervalId = setInterval(() => {
      setBlink((prevBlink) => !prevBlink);
    }, 500); // Change the interval duration (in milliseconds) as needed

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty

  return (
    <div>
      <div
        onClick={
          addingGateways
            ? handleAddGateways
            : addingROI
            ? handleAddROIClick
            : addingConnectPoint
            ? handleAddConnectPoint
            : addingConnectPointROI
            ? handleAddConnectPointROIClick
            : () => {}
        }
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
              {Object.entries(roiCoordinatesPerGateway).map(
                ([gatewayId, coordinates]) => {
                  const sosActive = gatewaysWithSOS.includes(Number(gatewayId));
                  if (coordinates.length > 0) {
                    return (
                      <Line
                        key={gatewayId}
                        points={coordinates}
                        stroke={sosActive ? "red" : "blue"}
                        strokeWidth={3}
                        fill={sosActive ? (blink ? "red" : "") : ""}
                        opacity={sosActive ? 0.6 : 1}
                        closed
                      />
                    );
                  }
                }
              )}
              {Object.entries(roiCoordinatesPerConnectPoint).map(
                ([connectPointId, coordinates]) => {
                  const sosActive = connectPointsWithSOS.includes(
                    Number(connectPointId)
                  );
                  if (coordinates.length > 0) {
                    return (
                      <Line
                        key={connectPointId}
                        points={coordinates}
                        stroke={sosActive ? "red" : "#DA0037"}
                        strokeWidth={3}
                        fill={sosActive ? (blink ? "red" : "") : ""}
                        opacity={sosActive ? 0.6 : 1}
                        closed
                      />
                    );
                  }
                }
              )}
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
          {allConnectPoints.map(
            (connectPoint, index) =>
              connectPoint.coords.x !== null && (
                <ConnectPointIndicator
                  index={index}
                  data={{
                    x: connectPoint.coords.x,
                    y: connectPoint.coords.y,
                    connectPointId: connectPoint.cpid,
                  }}
                  removeConnectPointFromMap={removeConnectPointFromMap}
                  connectPointsWithSOS={connectPointsWithSOS}
                />
              )
          )}
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
      {isConnectPointModalOpen && (
        <ConnectPointModal
          allConnectPoints={allConnectPoints}
          selectedConnectPointId={selectedConnectPointId}
          onConnectPointSelect={handleConnectPointSelect}
          onSubmit={handleConnectPointModalSubmit}
          onClose={closeConnectPointModal}
        />
      )}
      {isROIModalOpen && (
        <ROIModal
          allGateways={allGateways}
          onSubmit={handleROIModalSubmit}
          onClose={closeROIModal}
        />
      )}
      {isConnectPointROIModalOpen && (
        <ConnectPointROIModal
          allConnectPoints={allConnectPoints}
          onSubmit={handleConnectPointROIModalSubmit}
          onClose={closeConnectPointROIModal}
        />
      )}
    </div>
  );
}

export default GeoFencing;
