import SelectMapName from "./SelectMapName";
import SelectMapView from "./SelectMapView";
import AddDevice from "./AddDevice";

export default function MapOptions() {
  return (
    <div className="flex justify-between items-center">
      <SelectMapName />
      <AddDevice />
      <SelectMapView />
    </div>
  );
}
