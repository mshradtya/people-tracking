import { useState } from "react";
import ConnectPointLogsTable from "./ConnectPointLogsTable";
import ConnectPointLogsOptions from "./ConnectPointLogsOptions";

export default function ConnectPointLogs() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <ConnectPointLogsOptions onDateChange={handleDateChange} />
      <ConnectPointLogsTable selectedDate={selectedDate} />
    </>
  );
}
