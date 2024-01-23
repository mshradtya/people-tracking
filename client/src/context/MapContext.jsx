import { createContext, useState } from "react";

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const [mapName, setMapName] = useState("map1");
  const [mapView, setMapView] = useState("live-tracking");

  return (
    <MapContext.Provider value={{ mapName, setMapName, mapView, setMapView }}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
