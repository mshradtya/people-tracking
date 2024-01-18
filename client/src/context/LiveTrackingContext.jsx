import { createContext, useState } from "react";

const LiveTrackingContext = createContext({});

export const LiveTrackingProvider = ({ children }) => {
  const [layoutName, setLayoutName] = useState("layout1");

  return (
    <LiveTrackingContext.Provider value={{ layoutName, setLayoutName }}>
      {children}
    </LiveTrackingContext.Provider>
  );
};

export default LiveTrackingContext;
