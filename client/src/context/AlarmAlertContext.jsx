import React, { createContext, useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import Button from "@mui/material/Button";
import { useSnackbar, closeSnackbar } from "notistack";
import alarmAudio from "/alarm.mp3";

const AlarmAlertContext = createContext();

export const AlarmAlertProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [alarmInfo, setAlarmInfo] = useState([]);
  const [batteryAlarmInfo, setBatteryAlarmInfo] = useState([]);
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
          `/beacon/update/ack?bnid=${beaconToAck.bnid}&ack=false&sos=L&idle=L`
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

  const closeBatteryAlert = async (snackbarId) => {
    try {
      const beaconToAck = batteryAlarmInfo.find(
        (info) => info.bnid === snackbarId - 100
      );
      if (beaconToAck) {
        // await axiosPrivate.post(
        //   `/beacon/update/lowBattery?bnid=${beaconToAck.bnid}`
        // );
        setBatteryAlarmInfo((prevAlarmInfo) =>
          prevAlarmInfo.filter((info) => info.bnid !== snackbarId - 100)
        );
      }
      closeSnackbar(snackbarId);
    } catch (err) {
      console.log(err);
    }
  };

  const alertAction = (snackbarId) => (
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

  const batteryAlertAction = (snackbarId) => (
    <>
      <Button
        variant="filled"
        color="inherit"
        onClick={() => closeBatteryAlert(snackbarId)}
      >
        OK
      </Button>
    </>
  );

  useEffect(() => {
    alarmInfo.forEach((info) => {
      if (info.status && info.type === "sos") {
        enqueueSnackbar(
          `SOS By ${info.user} (ID: ${info.bnid}) - Connect Point ${info.cpid}`,
          {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "bottom" },
            key: info.bnid, // Use a unique key for each snackbar
            preventDuplicate: true,
            persist: true,
            action: alertAction,
          }
        );
      } else if (info.status && info.type === "idle") {
        enqueueSnackbar(
          `Unusual Idle Time Detected For ${info.user} (ID: ${info.bnid}) - Connect Point ${info.cpid}`,
          {
            variant: "warning",
            anchorOrigin: { horizontal: "center", vertical: "bottom" },
            key: info.bnid, // Use a unique key for each snackbar
            preventDuplicate: true,
            persist: true,
            action: alertAction,
          }
        );
      }
    });
  }, [alarmInfo]);

  useEffect(() => {
    batteryAlarmInfo.forEach((info) => {
      enqueueSnackbar(
        `User ${info.user}'s Beacon Battery Is Low (ID: ${info.bnid}) - ${info.battery}%`,
        {
          variant: "info",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
          key: info.bnid + 100, // adding 100 so it doesn't conflict with sos and idle detection snackbar ids
          preventDuplicate: true,
          persist: true,
          action: batteryAlertAction,
        }
      );
    });
  }, [batteryAlarmInfo]);

  const showAlert = (beacon, detectionType) => {
    const isAlreadyPresent = alarmInfo.some(
      (info) => info.bnid === beacon.bnid && info.cpid === beacon.cpid
    );

    if (!isAlreadyPresent) {
      setAlarmInfo((prevAlarmInfo) => [
        ...prevAlarmInfo,
        {
          status: true,
          type: detectionType,
          bnid: beacon.bnid,
          cpid: beacon.cpid,
          user: beacon.username,
        },
      ]);
    }
  };

  const showBatteryAlert = (beacon) => {
    const isAlreadyPresent = batteryAlarmInfo.some(
      (info) => info.bnid === beacon.bnid
    );

    if (!isAlreadyPresent) {
      setBatteryAlarmInfo((prevAlarmInfo) => [
        ...prevAlarmInfo,
        {
          status: true,
          bnid: beacon.bnid,
          cpid: beacon.cpid,
          user: beacon.username,
          battery: beacon.battery,
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
    <AlarmAlertContext.Provider
      value={{ showAlert, showBatteryAlert, batteryAlarmInfo, alarmInfo }}
    >
      {children}
    </AlarmAlertContext.Provider>
  );
};

export default AlarmAlertContext;
