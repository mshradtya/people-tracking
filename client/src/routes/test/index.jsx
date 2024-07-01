import React, { useEffect, useRef } from "react";

const FullscreenButton = () => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        buttonRef.current.textContent = "Exit Full Screen";
      } else {
        buttonRef.current.textContent = "Go Full Screen";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button ref={buttonRef} onClick={toggleFullScreen}>
      Go Full Screen
    </button>
  );
};

export default FullscreenButton;
