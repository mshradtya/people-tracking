import { useState } from "react";
import PathLogsOptions from "./PathLogsOptions";
import PathLogsTable from "./PathLogsTable";

export default function PathLogs() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBnid, setSelectedBnid] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBnidChange = (bnid) => {
    setSelectedBnid(bnid);
  };

  return (
    <>
      <PathLogsOptions
        onDateChange={handleDateChange}
        onBnidChange={handleBnidChange}
      />
      <PathLogsTable selectedDate={selectedDate} selectedBnid={selectedBnid} />
    </>
  );
}
