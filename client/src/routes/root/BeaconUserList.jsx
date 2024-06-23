import React, { useEffect } from "react";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import { getMinutesDifference } from "@/utils/helpers";
import BatteryIcon from "@/components/shared/BatteryIcon";
import useMap from "@/hooks/useMap";
import { useAlarmAlert } from "@/hooks/useAlarmAlert";

function BeaconUserList() {
  const { beaconColors } = useMap();
  const { beacons, fetchBeacons } = useFetchBeacons();
  const { sosAlarmInfo, idleAlarmInfo } = useAlarmAlert();

  useEffect(() => {
    fetchBeacons();
    const fetchBeaconsInterval = setInterval(fetchBeacons, 300);

    return () => {
      clearInterval(fetchBeaconsInterval);
    };
  }, []);

  return (
    <div className="beacon-container">
      {beacons.map((beacon, index) => {
        if (beacon.timestamp) {
          const minutesDifference = getMinutesDifference(beacon.timestamp);
          if (
            minutesDifference < 1 &&
            beacon.boundingBox.length > 0 &&
            !beacon.isInDcsRoom
          ) {
            return (
              <div
                key={index}
                className="beacon-card"
                style={{
                  border: sosAlarmInfo.some((info) => info.bnid === beacon.bnid)
                    ? "5px solid red"
                    : idleAlarmInfo.some((info) => info.bnid === beacon.bnid)
                    ? "5px solid #FF4500"
                    : `5px solid ${beaconColors[beacon.bnid]}`,
                }}
              >
                <span
                  className="beacon-bnid"
                  style={{
                    color: sosAlarmInfo.some(
                      (info) => info.bnid === beacon.bnid
                    )
                      ? "red"
                      : idleAlarmInfo.some((info) => info.bnid === beacon.bnid)
                      ? "#FF4500"
                      : `${beaconColors[beacon.bnid]}`,
                  }}
                >
                  {beacon.bnid < 10 ? "0" + beacon.bnid : beacon.bnid}
                </span>
                <span
                  className="beacon-username"
                  style={{
                    color: beacon.username
                      ? sosAlarmInfo.some((info) => info.bnid === beacon.bnid)
                        ? "red"
                        : idleAlarmInfo.some(
                            (info) => info.bnid === beacon.bnid
                          )
                        ? "#FF4500"
                        : `${beaconColors[beacon.bnid]}`
                      : "red",
                  }}
                >
                  {beacon.username ? beacon.username : "Unassigned"}
                </span>
                <span
                  className="beacon-battery"
                  style={{
                    color: beacon.battery
                      ? sosAlarmInfo.some((info) => info.bnid === beacon.bnid)
                        ? "red"
                        : idleAlarmInfo.some(
                            (info) => info.bnid === beacon.bnid
                          )
                        ? "#FF4500"
                        : `${beaconColors[beacon.bnid]}`
                      : "red",
                    fontWeight: "bold",
                  }}
                >
                  {beacon.battery ? `${beacon.battery}%` : "-"}
                  <BatteryIcon battery={beacon.battery} />
                </span>
              </div>
            );
          } else {
            return null;
          }
        }
      })}
      <style jsx>{`
        .beacon-container {
          height: 400px; /* Fixed height */
          overflow-y: auto; /* Add scrollbar if content overflows */
          border: 1px solid #e0e0e0; /* Optional: Add border for container */
          padding: 10px;
        }
        .beacon-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px;
          margin: 10px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 5px; /* Add some space between items */
        }
        .beacon-bnid {
          font-weight: bold;
          white-space: nowrap; /* Prevent line breaks */
        }
        .beacon-username {
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; /* Prevent line breaks */
          flex: 1; /* Allow this item to grow and take up remaining space */
          max-width: 100px; /* Set a maximum width */
        }
        .beacon-battery {
          font-weight: bold;
          white-space: nowrap; /* Prevent line breaks */
          display: flex;
          align-items: center;
          gap: 2px; /* Add space between text and battery icon */
        }
        /* Custom scrollbar styles for WebKit browsers */
        .beacon-container::-webkit-scrollbar {
          width: 4px; /* Width of the scrollbar */
        }
        .beacon-container::-webkit-scrollbar-track {
          border-radius: 10px;
        }
        .beacon-container::-webkit-scrollbar-thumb {
          border-radius: 10px;
        }
        .beacon-container::-webkit-scrollbar-thumb:hover {
        }
        /* Custom scrollbar styles for Firefox */
        .beacon-container {
          scrollbar-width: thin; /* Firefox: make the scrollbar thin */
        }
      `}</style>
    </div>
  );
}

export default BeaconUserList;
