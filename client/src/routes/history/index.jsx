import { useEffect, useState } from "react";
import SosHistoryTable from "./SosHistoryTable";
import SosHistoryOptions from "./SosHistoryOptions";

function SOSHistory() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <SosHistoryOptions onDateChange={handleDateChange} />
      <SosHistoryTable selectedDate={selectedDate} />
    </>
  );
}

export default SOSHistory;
