function formattedDate() {
  const formatted = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return formatted;
}

function lastPacketFormattedDate(date) {
  const [datePart, timePart] = date.split("$");
  const [year, month, day] = datePart.split("-");
  const [hours, minutes, seconds] = timePart.split(":");
  const formatted = new Date(year, month - 1, day, hours, minutes, seconds);
  return formatted.toISOString();
}

module.exports = { formattedDate, lastPacketFormattedDate };
