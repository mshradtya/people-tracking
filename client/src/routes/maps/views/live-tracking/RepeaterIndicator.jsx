import useMap from "@/hooks/useMap";

export default function RepeaterIndicator({ key, coord }) {
  const { scale } = useMap();

  return (
    <div
      key={key}
      style={{
        position: "absolute",
        left: `${coord.x}px`,
        top: `${coord.y}px`,
        width: "20px", // Increased the size for a larger, more popping circle
        height: "20px", // Increased the size for a larger, more popping circle
        borderRadius: "50%",
        backgroundColor: "black",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)", // Added a more pronounced box shadow
        transform: `scale(${1 / scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white", // Set the color to white
        fontWeight: "bold", // Added bold font for better visibility
      }}
    >
      <span style={{ fontSize: "12px" }}>R</span>{" "}
      {/* Adjusted font size for better proportion */}
    </div>
  );
}
