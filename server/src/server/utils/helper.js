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

const getMinutesDifference = (timestamp) => {
  const [datePart, timePart] = timestamp.split(", ");

  const [date, month, year] = datePart.split("/").map((part) => parseInt(part));

  const [time, period] = timePart.split(" ");
  const [hours, minutes, seconds] = time
    .split(":")
    .map((part) => parseInt(part));

  const fullYear = 2000 + year;

  const adjustedHours = (hours % 12) + (period.toLowerCase() === "pm" ? 12 : 0);

  const beaconTimestamp = new Date(
    fullYear,
    month - 1,
    date,
    adjustedHours,
    minutes,
    seconds
  );

  const currentTime = new Date();
  const timeDifference = currentTime - beaconTimestamp;
  const minutesDifference = timeDifference / (1000 * 60);

  return minutesDifference;
};

module.exports = {
  formattedDate,
  lastPacketFormattedDate,
  getMinutesDifference,
};
