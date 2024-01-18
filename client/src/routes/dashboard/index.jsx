import React from "react";
import InfoCard from "./InfoCard";
import Analytics from "./Analytics";

export default function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 sm-col-span-3 lg:col-span-1 hover:scale-105 transition duration-150">
          <InfoCard
            title={"Total Users"}
            count={25}
            bg={"red"}
            iconType={"user"}
          />
        </div>
        <div className="col-span-3 sm-col-span-3 lg:col-span-1 hover:scale-105 transition duration-150">
          <InfoCard
            title={"Total Devices"}
            count={45}
            bg={"green"}
            iconType={"department"}
          />
        </div>
        <div className="col-span-3 sm-col-span-3 lg:col-span-1 hover:scale-105 transition duration-150">
          <InfoCard
            title={"Active Devices"}
            count={42}
            bg={"blue"}
            iconType={"deviceActive"}
          />
        </div>
      </div>
      <div className="mt-5">
        <Analytics />
      </div>
    </div>
  );
}
