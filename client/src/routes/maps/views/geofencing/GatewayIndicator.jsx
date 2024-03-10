import useMap from "@/hooks/useMap";

export default function GatewayIndicator({
  index,
  data,
  removeGatewayFromMap,
}) {
  const { scale } = useMap();
  const handleDoubleClick = () => {
    // Remove gateway indicator and send POST request
    removeGatewayFromMap(data.gatewayId);
  };

  return (
    <div
      onClick={() => console.log(data)}
      onDoubleClick={handleDoubleClick}
      key={index}
      style={{
        position: "absolute",
        left: `${data.x}px`,
        top: `${data.y}px`,
        width: "20px", // Increased the size for a larger, more popping circle
        height: "20px", // Increased the size for a larger, more popping circle
        borderRadius: "20%",
        backgroundColor: "blue",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)", // Added a more pronounced box shadow
        transform: `scale(${1 / scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white", // Set the color to white
        fontWeight: "bold", // Added bold font for better visibility
      }}
    >
      <span style={{ fontSize: "12px" }}>G</span>{" "}
      {/* Adjusted font size for better proportion */}
    </div>
  );
}
