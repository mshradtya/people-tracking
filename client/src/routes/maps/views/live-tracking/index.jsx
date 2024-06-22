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
import { useFetchConnectPointsNotWorking } from "@/hooks/useFetchConnectPointsNotWorking";
import { useFetchGatewaysNotWorking } from "@/hooks/useFetchGatewaysNotWorking";
import BeaconIndicator from "./BeaconIndicator";
import { getMinutesDifference } from "@/utils/helpers";

function LiveTracking() {
  const {
    mapName,
    addingGateways,
    addingConnectPoint,
    addingConnectPointROI,
    showROI,
  } = useMap();
  const { gateways, fetchGateways } = useFetchGateways();
  const { beacons, fetchBeacons } = useFetchBeacons();
  const { connectPoints, fetchConnectPoints } = useFetchConnectPoints();
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
  const [prevBeaconPositions, setPrevBeaconPositions] = useState({});
  const { notWorkingConnectPoints, fetchConnectPointsNotWorking } =
    useFetchConnectPointsNotWorking();
  const { notWorkingGateways, fetchGatewaysNotWorking } =
    useFetchGatewaysNotWorking();

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
    fetchGateways();
    // const fetchGatewaysInterval = setInterval(fetchGateways, 300);
    fetchConnectPoints();
    // const fetchConnectPointsInterval = setInterval(fetchConnectPoints, 300);
    fetchConnectPointsNotWorking();
    const fetchConnectPointsNotWorkingInterval = setInterval(
      fetchConnectPointsNotWorking,
      10000
    );
    fetchGatewaysNotWorking();
    const fetchGatewaysNotWorkingInterval = setInterval(
      fetchGatewaysNotWorking,
      10000
    );

    // Set initial random positions for all beacons
    const initialPositions = beacons.reduce((acc, beacon) => {
      acc[beacon.bnid] = { x: 0, y: 0 };
      return acc;
    }, {});
    setPrevBeaconPositions(initialPositions);

    return () => {
      clearInterval(fetchBeaconsInterval);
      clearInterval(fetchConnectPointsNotWorkingInterval);
      clearInterval(fetchGatewaysNotWorkingInterval);
      // clearInterval(fetchConnectPointsInterval);
      // clearInterval(fetchGatewaysInterval);
    };
  }, []);

  useEffect(() => {
    const { width, height } = useCalculateCanvasMeasures();
    setCanvasMeasures({ width, height });

    const imageToLoad = new window.Image();
    imageToLoad.src = `${mapName}.png`;
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
                    if (coordinates.length > 0) {
                      return (
                        <Line
                          key={connectPointId}
                          points={coordinates}
                          stroke={"purple"}
                          strokeWidth={3}
                          closed
                        />
                      );
                    }
                  }
                )}
            </Layer>
          </Stage>
          {beacons.map((beacon, index) => {
            if (beacon.timestamp) {
              const minutesDifference = getMinutesDifference(beacon.timestamp);
              // Check if the time difference is less than 2 minutes
              if (
                minutesDifference < 1 &&
                beacon.boundingBox.length > 0 &&
                !beacon.isInDcsRoom
              ) {
                return (
                  <BeaconIndicator
                    key={index}
                    index={index}
                    beacon={beacon}
                    prevBeaconPositions={prevBeaconPositions}
                    setPrevBeaconPositions={setPrevBeaconPositions}
                  />
                );
              } else {
                return null;
              }
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
                    timestamp: gateway.timestamp,
                  }}
                  notWorkingGateways={notWorkingGateways}
                  removeGatewayFromMap={removeGatewayFromMap}
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
                    timestamp: connectPoint.timestamp,
                  }}
                  removeConnectPointFromMap={removeConnectPointFromMap}
                  notWorkingConnectPoints={notWorkingConnectPoints}
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

export default LiveTracking;
