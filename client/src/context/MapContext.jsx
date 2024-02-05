import { createContext, useState } from "react";

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const [mapName, setMapName] = useState("map1");
  const [mapView, setMapView] = useState("live-tracking");
  const [addingRepeaters, setAddingRepeaters] = useState(false);
  const [addingGateways, setAddingGateways] = useState(false);

  return (
    <MapContext.Provider
      value={{
        mapName,
        setMapName,
        mapView,
        setMapView,
        addingRepeaters,
        setAddingRepeaters,
        addingGateways,
        setAddingGateways,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
