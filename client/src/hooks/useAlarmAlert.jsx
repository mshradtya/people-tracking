import { useContext } from "react";
import AlarmAlertContext from "../context/AlarmAlertContext";

export const useAlarmAlert = () => {
  const context = useContext(AlarmAlertContext);
  if (!context) {
    throw new Error("useAlarmAlert must be used within a AlarmAlertProvider");
  }
  return context;
};
