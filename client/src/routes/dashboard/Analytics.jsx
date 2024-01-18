import React from "react";
import Paper from "@mui/material/Paper";
import PieChart from "./charts/PieChart";
import AreaChart from "./charts/AreaChart";
import ScatterChart from "./charts/ScatterChart";
import BarChart from "./charts/BarChart";

export default function Analytics() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-5">
        <Paper elevation={2} square={false} sx={{ height: "400px" }}>
          <PieChart />
        </Paper>
      </div>
      <div className="col-span-7">
        <Paper elevation={2} square={false} sx={{ height: "400px" }}>
          <AreaChart />
        </Paper>
      </div>
      <div className="col-span-6">
        <Paper elevation={2} square={false} sx={{ height: "400px" }}>
          <ScatterChart />
        </Paper>
      </div>
      <div className="col-span-6">
        <Paper elevation={2} square={false} sx={{ height: "400px" }}>
          <BarChart />
        </Paper>
      </div>
    </div>
  );
}
