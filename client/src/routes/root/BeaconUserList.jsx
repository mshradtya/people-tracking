import React, { useEffect } from "react";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import { getMinutesDifference } from "@/utils/helpers";

function BeaconUserList() {
  const { beacons, fetchBeacons } = useFetchBeacons();

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
          // Check if the time difference is less than 2 minutes
          if (
            minutesDifference < 1 &&
            beacon.boundingBox.length > 0 &&
            !beacon.isInDcsRoom
          ) {
            return (
              <div key={index} className="beacon-card">
                <span className="beacon-bnid">
                  {beacon.bnid < 10 ? "0" + beacon.bnid : beacon.bnid}
                </span>
                <span
                  className="beacon-username"
                  style={{ color: beacon.username ? "" : "red" }}
                >
                  {beacon.username ? beacon.username : "Unassigned"}
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
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 10px;
          margin: 10px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .beacon-bnid {
          //   font-weight: bold;
          color: #333;
        }
        .beacon-username {
          color: #555;
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
