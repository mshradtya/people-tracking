import { useEffect } from "react";
import h337 from "heatmap.js";
import useMap from "@/hooks/useMap";

export default function Heatmap() {
  const { mapName } = useMap();

  useEffect(() => {
    var heatmapInstance = h337.create({
      container: document.querySelector(".heatmap-container"),
    });

    var points = [];
    var max = 0;
    var width = 840;
    var height = 600;
    var len = 20;

    while (len--) {
      var val = Math.floor(Math.random() * 100);
      max = Math.max(max, val);
      var point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val,
      };
      points.push(point);
    }

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
