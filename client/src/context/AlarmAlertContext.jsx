import React, { createContext, useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import Button from "@mui/material/Button";
import { useSnackbar, closeSnackbar } from "notistack";
import alarmAudio from "../../assets/alarm.mp3";

const AlarmAlertContext = createContext();

export const AlarmAlertProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [alarmInfo, setAlarmInfo] = useState([]);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const newAudioElement = new Audio(alarmAudio);
    setAudioElement(newAudioElement);

    return () => {
      newAudioElement.pause();
    };
  }, []);

  const closeAlert = async (snackbarId) => {
    try {
      const beaconToAck = alarmInfo.find((info) => info.bnid === snackbarId);
      if (beaconToAck) {
        await axiosPrivate.post(
          `/beacon/update/ack?bnid=${beaconToAck.bnid}&ack=false&sos=L`
        );
        setAlarmInfo((prevAlarmInfo) =>
          prevAlarmInfo.filter((info) => info.bnid !== snackbarId)
        );
      }
      closeSnackbar(snackbarId);
    } catch (err) {
      console.log(err);
    }
  };

  const action = (snackbarId) => (
    <>
      <Button
        variant="filled"
        color="inherit"
        onClick={() => closeAlert(snackbarId)}
      >
        OK
      </Button>
    </>
  );

  useEffect(() => {
    alarmInfo.forEach((info) => {
      if (info.status) {
        enqueueSnackbar(
          `SOS pressed for Beacon ${info.bnid} by ${info.user} under Connect Point ${info.cpid}`,
          {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "bottom" },
            key: info.bnid, // Use a unique key for each snackbar
            preventDuplicate: true,
            persist: true,
            action,
          }
        );
      }
    });
  }, [alarmInfo]);

  const showAlert = (beacon) => {
    const isAlreadyPresent = alarmInfo.some(
      (info) => info.bnid === beacon.bnid && info.cpid === beacon.cpid
    );

    if (!isAlreadyPresent) {
      setAlarmInfo((prevAlarmInfo) => [
        ...prevAlarmInfo,
        {
          status: true,
          bnid: beacon.bnid,
          cpid: beacon.cpid,
          user: beacon.username,
        },
      ]);
    }
  };

  useEffect(() => {
    if (alarmInfo.some((info) => info.status)) {
      audioElement.loop = true;
      audioElement.play();
    } else {
      audioElement?.pause();
    }
  }, [alarmInfo]);

  return (
    <AlarmAlertContext.Provider value={{ showAlert }}>
      {children}
    </AlarmAlertContext.Provider>
  );
};

export default AlarmAlertContext;
