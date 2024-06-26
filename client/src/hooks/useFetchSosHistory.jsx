import { useEffect, useState } from "react";
import useAxiosPrivate from "./auth/useAxiosPrivate";
import { useSnackbar } from "./useSnackbar";

const useFetchSosHistory = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historySerialNumber, setHistorySerialNumber] = useState(1);

  const fetchSosHistory = async (selectedDate, selectedShift) => {
    try {
      const response = await axiosPrivate.get(
        `/beacon/sos/history/date?date=${selectedDate}&shift=${selectedShift}`
      );
      setHistory(response.data.history);
      setIsHistoryLoading(false);
      setHistorySerialNumber(1);
    } catch (error) {
      showSnackbar("error", error.response.data.message);
    }
  };

  return {
    history,
    isHistoryLoading,
    historySerialNumber,
    fetchSosHistory,
  };
};

export { useFetchSosHistory };
