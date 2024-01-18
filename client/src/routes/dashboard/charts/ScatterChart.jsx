import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  layout: {
    padding: {
      left: 30,
      right: 30,
      top: 30,
      bottom: 30,
    },
  },
  maintainAspectRatio: false,
};

export const data = {
  datasets: [
    {
      label: "A dataset",
      data: [
        // { x: -50, y: 30 },
        // { x: 10, y: -20 },
        // { x: 30, y: 50 },
        // { x: -20, y: -10 },
        // { x: 40, y: 25 },
        // { x: 0, y: 0 },
        // { x: -30, y: 40 },
        // { x: 20, y: -5 },
        // { x: 15, y: 35 },
        // { x: -10, y: 15 },
        // { x: 5, y: -30 },
        // { x: -40, y: -15 },
        // Add more data points as needed to reach a total of 50
      ],
      backgroundColor: "rgba(255, 99, 132, 1)",
    },
  ],
};

// Add more data points to reach a total of 50
for (let i = 0; i < 38; i++) {
  data.datasets[0].data.push({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
  });
}

export default function ScatterChart() {
  return <Scatter options={options} data={data} height={"100%"} />;
}
