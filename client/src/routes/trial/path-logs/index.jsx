import { useState } from "react";
import PathLogsOptions from "./PathLogsOptions";
import PathLogsTable from "./PathLogsTable";

export default function PathLogs() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <PathLogsOptions onDateChange={handleDateChange} />
      <PathLogsTable selectedDate={selectedDate} />
    </>
  );
}
