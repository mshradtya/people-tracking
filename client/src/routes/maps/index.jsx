import { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import FullscreenLayout from "./views/full-screen/FullscreenLayout";
import MapOptions from "./options";
import LiveTracking from "./views/live-tracking";
import PathTracking from "./views/path-tracking/PathTracking";
// import Heatmap from "./views/heatmap";
import useMap from "@/hooks/useMap";
import GeoFencing from "./views/geofencing";

export default function Maps() {
  const {
    mapName,
    mapView,
    addingConnectPoint,
    addingGateways,
    addingConnectPointROI,
    scale,
    setScale,
  } = useMap();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const views = {
    "live-tracking": <LiveTracking />,
    "path-tracking": <PathTracking />,
    // heatmap: <Heatmap />,
    "sos-alert": <GeoFencing />,
  };

  function handleScaleChange(event) {
    // console.log(event.instance.transformState.scale);
    setScale(event.instance.transformState.scale);
  }

  return (
    <div>
      <MapOptions />
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
          <TransformWrapper
            disabled={
              addingConnectPoint || addingGateways || addingConnectPointROI
                ? true
                : false
            }
            onTransformed={(e) => handleScaleChange(e)}
            initialScale={scale}
            minScale={1}
            maxScale={2.5}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                {addingGateways || addingConnectPoint || addingConnectPointROI
                  ? resetTransform(1)
                  : null}
                <div
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "15px",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 999,
                  }}
                >
                  {/* <IconButton
                    onClick={() => handleOpen()}
                    color="primary"
                    sx={{
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                      color: "black",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <OpenInFullIcon />
                  </IconButton> */}
                  <IconButton
                    onClick={() => zoomIn()}
                    color="primary"
                    sx={{
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                      color: "black",
                      borderRadius: "8px",
                      marginTop: "5px",
                      backgroundColor: "#fff",
                    }}
                    disabled={
                      addingConnectPoint ||
                      addingGateways ||
                      addingConnectPointROI
                        ? true
                        : false
                    }
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => zoomOut()}
                    color="primary"
                    sx={{
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      marginTop: "5px",
                      color: "black",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                    disabled={
                      addingConnectPoint ||
                      addingGateways ||
                      addingConnectPointROI
                        ? true
                        : false
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                </div>
                <TransformComponent>{views[mapView]}</TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>
      <FullscreenLayout
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </div>
  );
}
