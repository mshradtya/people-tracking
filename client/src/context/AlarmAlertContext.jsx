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
          `/beacon/update/ack?type=sos&bnid=${beaconToAck.bnid}`
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
          `/beacon/update/ack?type=idle&bnid=${beaconToAck.bnid}`
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
        sx={{
          // fontWeight: "bold",
          fontSize: "20px",
          backgroundColor: "red",
        }}
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
        `SOS By ${info.user !== "" ? info.user : "NA"} (ID: ${info.bnid}) at ${
          info.timestamp
        }`,
        {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
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
        `Idle Detection for ${info.user !== "" ? info.user : "NA"} (ID: ${
          info.bnid
        }) at ${info.timestamp}`,
        {
          variant: "warning",
          anchorOrigin: { horizontal: "center", vertical: "top" },
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
        `${info.user}'s Beacon Battery Is Low (ID: ${info.bnid}) - ${info.battery}% at ${info.timestamp}`,
        {
          variant: "info",
          anchorOrigin: { horizontal: "center", vertical: "top" },
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
          timestamp: beacon.timestamp,
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
          timestamp: beacon.timestamp,
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
          timestamp: beacon.timestamp,
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
