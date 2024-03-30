import SelectMapName from "./SelectMapName";
import SelectMapView from "./SelectMapView";
import AddDevice from "./AddDevice";
import AddConnectPoint from "./AddConnectPoint";
import AddROI from "./AddROI";
import AddConnectPointROI from "./AddConnectPointROI";
import useAuth from "../../../hooks/auth/useAuth";

export default function MapOptions() {
  const { auth } = useAuth();
  const isSuperAdmin = auth.role === "SuperAdmin";

  return (
    <div className="flex justify-between items-center">
      <SelectMapName />
      {isSuperAdmin && (
        <>
          <AddDevice />
          <AddROI />
          <AddConnectPoint />
          <AddConnectPointROI />
        </>
      )}
      <SelectMapView />
    </div>
  );
}
