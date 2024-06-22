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

  const [day, month, year] = datePart.split("/").map((part) => parseInt(part));

  const [time, period] = timePart.split(" ");
  const [hours, minutes, seconds] = time
    .split(":")
    .map((part) => parseInt(part));

  const fullYear = 2000 + year;

  // Adjust the hours to 24-hour format based on the period
  let adjustedHours = hours % 12;
  if (period.toLowerCase() === "pm") {
    adjustedHours += 12;
  }

  // Create a new Date object for the timestamp
  const beaconTimestamp = new Date(
    fullYear,
    month - 1,
    day,
    adjustedHours,
    minutes,
    seconds
  );

  // Get the current time
  const currentTime = new Date();

  // Calculate the difference in time between the current time and the timestamp in milliseconds
  const timeDifference = currentTime - beaconTimestamp;

  // Convert the time difference to minutes
  const minutesDifference = timeDifference / (1000 * 60);

  return minutesDifference;
};

module.exports = {
  formattedDate,
  lastPacketFormattedDate,
  getMinutesDifference,
};
