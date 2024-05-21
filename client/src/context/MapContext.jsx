import { createContext, useState } from "react";

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [mapName, setMapName] = useState("map1");
  const [mapView, setMapView] = useState("live-tracking");
  const [addingRepeaters, setAddingRepeaters] = useState(false);
  const [addingGateways, setAddingGateways] = useState(false);
  const [addingConnectPoint, setAddingConnectPoint] = useState(false);
  const [addingConnectPointROI, setAddingConnectPointROI] = useState(false);
  const [showROI, setShowROI] = useState(true);

  return (
    <MapContext.Provider
      value={{
        scale,
        setScale,
        mapName,
        setMapName,
        mapView,
        setMapView,
        addingRepeaters,
        setAddingRepeaters,
        addingGateways,
        setAddingGateways,
        addingConnectPoint,
        setAddingConnectPoint,
        addingConnectPointROI,
        setAddingConnectPointROI,
        showROI,
        setShowROI,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
