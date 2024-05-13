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

export { getMinutesDifference };
