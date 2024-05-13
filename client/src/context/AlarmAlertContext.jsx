import React, { createContext, useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import Button from "@mui/material/Button";
import { useSnackbar, closeSnackbar } from "notistack";
import alarmAudio from "/alarm.mp3";

const AlarmAlertContext = createContext();

export const AlarmAlertProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [sosAlarmInfo, setSosAlarmInfo] = useState([]);
  const [idleAlarmInfo, setIdleAlarmInfo] = useState([]);
  const [batteryAlarmInfo, setBatteryAlarmInfo] = useState([]);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const newAudioElement = new Audio(alarmAudio);
    setAudioElement(newAudioElement);

    return () => {
      newAudioElement.pause();
    };
  }, []);

  const closeSosAlert = async (snackbarId) => {
    try {
      const beaconToAck = sosAlarmInfo.find((info) => info.bnid === snackbarId);
      if (beaconToAck) {
        await axiosPrivate.post(
          `/beacon/update/ack?bnid=${beaconToAck.bnid}&ack=false&sos=L&idle=L`
        );
        setSosAlarmInfo((prevAlarmInfo) =>
          prevAlarmInfo.filter((info) => info.bnid !== snackbarId)
        );
      }
      closeSnackbar(snackbarId);
    } catch (err) {
      console.log(err);
    }
  };

  const closeIdleAlert = async (snackbarId) => {
    try {
      const beaconToAck = idleAlarmInfo.find(
        (info) => info.bnid === snackbarId
      );
      if (beaconToAck) {
        await axiosPrivate.post(
          `/beacon/update/ack?bnid=${beaconToAck.bnid}&ack=false&sos=L&idle=L`
        );
        setIdleAlarmInfo((prevAlarmInfo) =>
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
        setBatteryAlarmInfo((prevAlarmInfo) =>
          prevAlarmInfo.filter((info) => info.bnid !== snackbarId - 100)
        );
      }
      closeSnackbar(snackbarId);
    } catch (err) {
      console.log(err);
    }
  };

  const sosAlertAction = (snackbarId) => (
    <>
      <Button
        variant="filled"
        color="inherit"
        onClick={() => closeSosAlert(snackbarId)}
      >
        OK
      </Button>
    </>
  );

  const idleAlertAction = (snackbarId) => (
    <>
      <Button
        variant="filled"
        color="inherit"
        onClick={() => closeIdleAlert(snackbarId)}
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
    sosAlarmInfo.forEach((info) => {
      enqueueSnackbar(
        `SOS By ${info.user !== "" ? info.user : "NA"} (ID: ${
          info.bnid
        }) - Connect Point ${info.cpid}`,
        {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
          key: info.bnid, // Use a unique key for each snackbar
          preventDuplicate: true,
          persist: true,
          action: sosAlertAction,
        }
      );
    });
  }, [sosAlarmInfo]);

  useEffect(() => {
    idleAlarmInfo.forEach((info) => {
      enqueueSnackbar(
        `Unusual Idleness Detected for ${info.user} (ID: ${info.bnid}) - Connect Point ${info.cpid}`,
        {
          variant: "warning",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
          key: info.bnid, // Use a unique key for each snackbar
          preventDuplicate: true,
          persist: true,
          action: idleAlertAction,
        }
      );
    });
  }, [idleAlarmInfo]);

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

  const showSosAlert = (beacon) => {
    const isAlreadyPresent = sosAlarmInfo.some(
      (info) => info.bnid === beacon.bnid && info.cpid === beacon.cpid
    );

    if (!isAlreadyPresent) {
      setSosAlarmInfo((prevAlarmInfo) => [
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

  const showIdleAlert = (beacon) => {
    const isAlreadyPresent = idleAlarmInfo.some(
      (info) => info.bnid === beacon.bnid && info.cpid === beacon.cpid
    );

    if (!isAlreadyPresent) {
      setIdleAlarmInfo((prevAlarmInfo) => [
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
    if (
      sosAlarmInfo.some((info) => info.status) ||
      idleAlarmInfo.some((info) => info.status)
    ) {
      audioElement.loop = true;
      audioElement.play();
    } else {
      audioElement?.pause();
    }
  }, [sosAlarmInfo, idleAlarmInfo]);

  return (
    <AlarmAlertContext.Provider
      value={{
        showSosAlert,
        showIdleAlert,
        showBatteryAlert,
        sosAlarmInfo,
        idleAlarmInfo,
        batteryAlarmInfo,
      }}
    >
      {children}
    </AlarmAlertContext.Provider>
  );
};

export default AlarmAlertContext;
