import { createContext, useState } from "react";

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [mapName, setMapName] = useState("map1");
  const [mapView, setMapView] = useState("geofencing");
  const [addingRepeaters, setAddingRepeaters] = useState(false);
  const [addingGateways, setAddingGateways] = useState(false);

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
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
