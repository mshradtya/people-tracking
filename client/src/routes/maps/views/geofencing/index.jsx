import { useState, useEffect } from "react";
import useMap from "@/hooks/useMap";
import { Stage, Layer, Image, Line } from "react-konva";
import GatewayIndicator from "./GatewayIndicator";
import useAxiosPrivate from "../../../../hooks/auth/useAxiosPrivate";
import { useSnackbar } from "../../../../hooks/useSnackbar";

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
  const [gatewayIds, setGatewayIds] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 0,
    height: 0,
  });
  const [clickedGatewayCoordinates, setClickedGatewayCoordinates] = useState(
    []
  );

  const fetchGateways = async () => {
    try {
      const response = await axiosPrivate.get("/gateways");
      setGatewayIds(() => {
        return response.data.gateways.map((gateway) => ({
          gwid: gateway.gwid,
          _id: gateway._id,
        }));
      });
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      // navigate("/login", { state: location, replace: true });
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

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
        {clickedGatewayCoordinates.map((coord, index) => (
          <GatewayIndicator key={index} coord={coord} />
        ))}
      </div>
    </div>
  );
}

export default GeoFencing;
