import SelectMapName from "./SelectMapName";
import SelectMapView from "./SelectMapView";
import AddDevice from "./AddDevice";
import AddConnectPoint from "./AddConnectPoint";
import AddROI from "./AddROI";
import AddConnectPointROI from "./AddConnectPointROI";

export default function MapOptions() {
  return (
    <div className="flex justify-between items-center">
      <SelectMapName />
      <AddDevice />
      <AddROI />
      <AddConnectPoint />
      <AddConnectPointROI />
      <SelectMapView />
    </div>
  );
}
