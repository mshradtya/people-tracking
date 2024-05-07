import { useContext } from "react";
import NotificationContext from "../context/NotificationContext";

export const useSnackbar = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a NotificationProvider");
  }
  return context;
};
