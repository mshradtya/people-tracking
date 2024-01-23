import { useState, useEffect } from "react";
import LiveTrackingIndicator from "./LiveTrackingIndicator";

export default function LiveTracking() {
  const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
  const [showAlert, setShowAlert] = useState(false);

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
    <LiveTrackingIndicator
      circlePosition={circlePosition}
      showAlert={showAlert}
    />
  );
}
