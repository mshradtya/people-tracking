import { useEffect, useState } from "react";
import SosHistoryTable from "./SosHistoryTable";
import SosHistoryOptions from "./SosHistoryOptions";

function SOSHistory() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleShiftChange = (shift) => {
    setSelectedShift(shift);
  };

  return (
    <>
      <SosHistoryOptions
        onDateChange={handleDateChange}
        onShiftChange={handleShiftChange}
      />
      <SosHistoryTable
        selectedDate={selectedDate}
        selectedShift={selectedShift}
      />
    </>
  );
}

export default SOSHistory;
