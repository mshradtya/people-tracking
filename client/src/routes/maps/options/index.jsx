import SelectMapName from "./SelectMapName";
import SelectMapView from "./SelectMapView";

export default function MapOptions() {
  return (
    <div className="flex justify-between items-center">
      <SelectMapName />
      <SelectMapView />
    </div>
  );
}
