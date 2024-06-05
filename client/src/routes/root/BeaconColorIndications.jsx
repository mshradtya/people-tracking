import React from "react";

function BeaconColorIndications() {
  return (
    <div className="beacon-indications">
      Beacon LED Indications
      <div className="beacon-indication">
        <span className="color-circle green"></span>
        <span className="description">Healthy</span>
      </div>
      <div className="beacon-indication">
        <span className="color-circle red"></span>
        <span className="description">Connection Error</span>
      </div>
      <div className="beacon-indication">
        <span className="color-circle blue"></span>
        <span className="description">Low Battery</span>
      </div>
      <style jsx>{`
        .beacon-indications {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 20px;
        }
        .beacon-indication {
          display: flex;
          align-items: center;
          gap: 10px;
          //   padding-left: 15px;
        }
        .color-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .green {
          background-color: green;
        }
        .red {
          background-color: red;
        }
        .blue {
          background-color: blue;
        }
        .description {
          font-size: 16px;
          color: #333;
        }
      `}</style>
    </div>
  );
}

export default BeaconColorIndications;
