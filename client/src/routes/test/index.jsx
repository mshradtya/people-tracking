import { useEffect } from "react";
import h337 from "heatmap.js";

const Test = () => {
  useEffect(() => {
    var heatmapInstance = h337.create({
      container: document.querySelector(".heatmap-container"),
    });

    var points = [];
    var max = 0;
    var width = 840;
    var height = 400;
    var len = 100;

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
    <div
      className="heatmap-container"
      style={{ position: "relative", width: "200vh", height: "100vh" }}
    >
      <img
        src="/map1.jpg" // replace with the actual image URL
        alt="Your Image"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default Test;
