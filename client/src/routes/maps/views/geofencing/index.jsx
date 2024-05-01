import { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import { Stage, Layer, Image, Line } from "react-konva";
import GatewayIndicator from "./GatewayIndicator";
import ConnectPointIndicator from "./ConnectPointIndicator";
import useAxiosPrivate from "../../../../hooks/auth/useAxiosPrivate";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import ConnectPointROIModal from "./ConnectPointROIModal";

import GatewayModal from "./GatewayModal";
import ConnectPointModal from "./ConnectPointModal";
import { useFetchGateways } from "@/hooks/useFetchGateways";
import { useFetchConnectPoints } from "@/hooks/useFetchConnectPoints";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import { useCalculateCanvasMeasures } from "@/hooks/useCalculateCanvasMeasures";
import useAuth from "@/hooks/auth/useAuth";
import BeaconIndicator from "./BeaconIndicator";

function GeoFencing() {
  const { auth } = useAuth();
  const {
    mapName,
    addingGateways,
    addingConnectPoint,
    addingConnectPointROI,
    showROI,
  } = useMap();
  const { gateways, fetchGateways, gatewaysWithSOS, fetchGatewaysWithSOS } =
    useFetchGateways();
  const { beacons, fetchBeacons } = useFetchBeacons();
  const {
    connectPoints,
    fetchConnectPoints,
    connectPointsWithSOS,
    fetchConnectPointsWithSOS,
  } = useFetchConnectPoints();
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();

  const [image, setImage] = useState(null);
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 0,
    height: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectPointModalOpen, setIsConnectPointModalOpen] = useState(false);
  const [isConnectPointROIModalOpen, setIsConnectPointROIModalOpen] =
    useState(false);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [roiCoordinatesPerConnectPoint, setRoiCoordinatesPerConnectPoint] =
    useState({});
  const [selectedGatewayId, setSelectedGatewayId] = useState(null);
  const [selectedConnectPointId, setSelectedConnectPointId] = useState(null);
  const [selectedConnectPointForROI, setSelectedConnectPointForROI] =
    useState(null);
  const [blink, setBlink] = useState(true);
  const [prevBeaconPositions, setPrevBeaconPositions] = useState({});

  useEffect(() => {
    connectPoints.map((connectPoint) => {
      setRoiCoordinatesPerConnectPoint((prev) => {
        return {
          ...prev,
          [connectPoint.cpid]: connectPoint.roiCoords,
        };
      });
    });
  }, [connectPoints]);

  useEffect(() => {
    fetchBeacons();
    const fetchBeaconsInterval = setInterval(fetchBeacons, 300);

    // Set initial random positions for all beacons
    const initialPositions = beacons.reduce((acc, beacon) => {
      acc[beacon.bnid] = { x: 0, y: 0 };
      return acc;
    }, {});
    setPrevBeaconPositions(initialPositions);

    return () => {
      clearInterval(fetchBeaconsInterval);
    };
  }, []);

  useEffect(() => {
    fetchGateways();
    fetchConnectPoints();
    // fetchBeacons();
    // const fetchGatewaysWithSOSInterval = setInterval(fetchGatewaysWithSOS, 300);
    // const fetchConnectPointsWithSOSInterval = setInterval(
    //   fetchConnectPointsWithSOS,
    //   300
    // );
    // const fetchBeaconsInterval = setInterval(fetchBeacons, 300);

    return () => {
      // clearInterval(fetchGatewaysWithSOSInterval);
      // clearInterval(fetchConnectPointsWithSOSInterval);
      // clearInterval(fetchBeaconsInterval);
    };
  }, []);

  useEffect(() => {
    const { width, height } = useCalculateCanvasMeasures();
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
          roiCoords: [],
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

  const openConnectPointROIModal = () => {
    setIsConnectPointROIModalOpen(true);
  };

  const closeConnectPointROIModal = () => {
    setIsConnectPointROIModalOpen(false);
  };

  const handleConnectPointROIModalSubmit = (connectPointId) => {
    setSelectedConnectPointForROI(connectPointId);
    closeConnectPointROIModal();
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
    if (
      roiCoordinatesPerConnectPoint[selectedConnectPointForROI]?.length === 8
    ) {
      // setAddingROI(false);
      updateConnectPointROICoordinates(selectedConnectPointForROI);
      setSelectedConnectPointForROI(null);
      fetchConnectPoints();
    }
  }, [roiCoordinatesPerConnectPoint]);

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
        roiCoords: [],
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
              {showROI &&
                Object.entries(roiCoordinatesPerConnectPoint).map(
                  ([connectPointId, coordinates]) => {
                    // const sosActive = connectPointsWithSOS.includes(
                    //   Number(connectPointId)
                    // );
                    if (coordinates.length > 0) {
                      return (
                        <Line
                          key={connectPointId}
                          points={coordinates}
                          // stroke={sosActive ? "red" : "purple"}
                          stroke={"#df7dfa"}
                          strokeWidth={3}
                          // opacity={sosActive ? 0.6 : 1}
                          closed
                        />
                      );
                    }
                  }
                )}
            </Layer>
          </Stage>
          {beacons.map((beacon, index) => {
            // Parse beacon timestamp
            const beaconTimestamp = new Date(beacon.timestamp);
            // Calculate the time difference in milliseconds
            const timeDifference = new Date() - beaconTimestamp;
            // Convert milliseconds to minutes
            const minutesDifference = timeDifference / (1000 * 60);

            // Check if the time difference is less than 2 minutes
            if (minutesDifference < 50 && beacon.boundingBox.length > 0) {
              return (
                <BeaconIndicator
                  key={index} // Make sure to include a unique key for each element in the map
                  index={index}
                  beacon={beacon}
                  prevBeaconPositions={prevBeaconPositions}
                  setPrevBeaconPositions={setPrevBeaconPositions}
                />
              );
            } else {
              return null; // Don't render the beacon if the condition is not met
            }
          })}

          {gateways.map(
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
                  // gatewaysWithSOS={gatewaysWithSOS}
                />
              )
          )}
          {connectPoints.map(
            (connectPoint, index) =>
              connectPoint.coords.x !== null && (
                <ConnectPointIndicator
                  index={index}
                  data={{
                    x: connectPoint.coords.x,
                    y: connectPoint.coords.y,
                    connectPointId: connectPoint.cpid,
                    pillarStart: connectPoint.pillarStart,
                    pillarEnd: connectPoint.pillarEnd,
                  }}
                  removeConnectPointFromMap={removeConnectPointFromMap}
                  // connectPointsWithSOS={connectPointsWithSOS}
                />
              )
          )}
        </div>
      </div>
      {isModalOpen && (
        <GatewayModal
          allGateways={gateways}
          selectedGatewayId={selectedGatewayId}
          onGatewaySelect={handleGatewaySelect}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}
      {isConnectPointModalOpen && (
        <ConnectPointModal
          connectPoints={connectPoints}
          selectedConnectPointId={selectedConnectPointId}
          onConnectPointSelect={handleConnectPointSelect}
          onSubmit={handleConnectPointModalSubmit}
          onClose={closeConnectPointModal}
        />
      )}
      {isConnectPointROIModalOpen && (
        <ConnectPointROIModal
          connectPoints={connectPoints}
          onSubmit={handleConnectPointROIModalSubmit}
          onClose={closeConnectPointROIModal}
        />
      )}
    </div>
  );
}

export default GeoFencing;
