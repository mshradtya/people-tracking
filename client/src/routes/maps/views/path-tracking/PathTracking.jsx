import { useState, useEffect } from "react";
import { Stage, Layer, Image, Line } from "react-konva";
import PersonIcon from "@mui/icons-material/Person";
import { Tooltip } from "@mui/material";

import useMap from "@/hooks/useMap";

export default function PathTracking() {
  const { mapName } = useMap();
  const [image, setImage] = useState(null);
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 0,
    height: 0,
  });
  const indicatorsData = [{ position: { x: 135, y: 100 }, color: "green" }];

  useEffect(() => {
    const calculateCanvasMeasures = () => {
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
    };

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
  }, [mapName, canvasMeasures]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "20px",
      }}
    >
      <div
        className="h-[calc(100vh-120px)] rounded-lg border-2 relative"
        style={{
          boxShadow:
            "-1px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
        }}
      >
        <Stage width={canvasMeasures.width} height={canvasMeasures.height}>
          <Layer>
            <Image image={image} />
            {/* Dummy path */}
            <Line
              points={[150, 120, 150, 460, 400, 460, 400, 200, 600, 200]}
              stroke="green"
              strokeWidth={4}
            />
          </Layer>
        </Stage>
        {indicatorsData.map((data, index) => (
          <PathTrackingIndicator
            key={index}
            circlePosition={data.position}
            color={data.color}
          />
        ))}
      </div>
    </div>
  );
}

function PathTrackingIndicator({ circlePosition, color }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${circlePosition.x}px`,
        top: `${circlePosition.y}px`,
        width: "30px",
        height: "30px",
        background: `${color}`,
        color: "white",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "left 0.5s ease-out, top 0.5s ease-out, background 0.5s ease-out",
        borderRadius: "20px",
      }}
    >
      <Tooltip title="30 minutes">
        <PersonIcon />
      </Tooltip>
    </div>
  );
}
