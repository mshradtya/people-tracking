import React, { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import WorkerIcon from "./WorkerIcon";
import FullscreenLayout from "./FullscreenLayout";
import SelectFloor from "./SelectFloor";

export default function LiveTracking() {
  const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  return (
    <div>
      <SelectFloor />
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
          style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        >
          <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
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
                  <IconButton
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
                  </IconButton>
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
                  >
                    <RemoveIcon />
                  </IconButton>
                </div>
                <TransformComponent>
                  <div>
                    <img
                      src="/layout.jpg"
                      alt="test"
                      className="rounded-lg h-[calc(100vh-120px)]"
                    />
                    <WorkerIcon
                      circlePosition={circlePosition}
                      showAlert={showAlert}
                    />
                  </div>
                </TransformComponent>
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
