import SelectMapName from "./SelectMapName";
import SelectMapView from "./SelectMapView";
import AddGateway from "./AddGateway";
import AddConnectPoint from "./AddConnectPoint";
import AddConnectPointROI from "./AddConnectPointROI";
import useAuth from "@/hooks/auth/useAuth";

export default function MapOptions() {
  const { auth } = useAuth();
  const isSuperAdmin = auth.role === "SuperAdmin";

  return (
    <div className="flex justify-between items-center">
      <SelectMapName />
      {isSuperAdmin && (
        <>
          <AddGateway />
          <AddConnectPoint />
          <AddConnectPointROI />
        </>
      )}
      <SelectMapView />
    </div>
  );
}
