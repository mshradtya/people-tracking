function formattedDate(date) {
  const formatted = new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
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
