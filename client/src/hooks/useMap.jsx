import { useContext } from "react";
import MapContext from "@/context/MapContext";

const useMap = () => {
  return useContext(MapContext);
};

export default useMap;
