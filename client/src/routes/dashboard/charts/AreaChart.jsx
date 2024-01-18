"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      // fill: true,
      label: "Dataset 2",
      data: [300, 450, 200, 700, 550, 800, 400],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const options = {
  scales: {
    x: {
      type: "category",
      labels: data.labels,
    },
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

export default function AreaChart() {
  return <Line data={data} options={options} height={"100%"} />;
}
