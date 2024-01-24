import { useEffect } from "react";
import h337 from "heatmap.js";
import useMap from "@/hooks/useMap";

export default function Heatmap() {
  const { mapName } = useMap();

  useEffect(() => {
    var heatmapInstance = h337.create({
      container: document.querySelector(".heatmap-container"),
    });

    var points = [
      { x: 100, y: 150, value: 60 },
      { x: 700, y: 160, value: 30 },
      { x: 100, y: 400, value: 70 },
    ];

    var max = Math.max(...points.map((point) => point.value));

    var data = {
      max: max,
      data: points,
    };

    heatmapInstance.setData(data);
  }, []);

  return (
    <div className="heatmap-container">
      <img
        src={`/${mapName}.jpg`}
        alt="test"
        className="rounded-lg h-[calc(100vh-120px)]"
      />
    </div>
  );
}
