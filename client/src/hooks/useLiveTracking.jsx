import { useContext } from "react";
import LiveTrackingContext from "@/context/LiveTrackingContext";

const useLiveTracking = () => {
  return useContext(LiveTrackingContext);
};

export default useLiveTracking;
