import SelectMapName from "./SelectMapName";
import SelectMapView from "./SelectMapView";
import AddDevice from "./AddDevice";
import AddROI from "./AddROI";

export default function MapOptions() {
  return (
    <div className="flex justify-between items-center">
      <SelectMapName />
      <AddDevice />
      <AddROI />
      <SelectMapView />
    </div>
  );
}
