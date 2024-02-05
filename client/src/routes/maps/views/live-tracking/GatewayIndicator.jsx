export default function GatewayIndicator({ key, coord }) {
  return (
    <div
      key={key}
      style={{
        position: "absolute",
        left: `${coord.x}px`,
        top: `${coord.y}px`,
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "blue",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    />
  );
}