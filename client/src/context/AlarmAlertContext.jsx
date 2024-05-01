import React, { createContext, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import IconButton from "@mui/material/IconButton";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlarmAlertContext = createContext();

export const AlarmAlertProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const [alarmInfo, setAlarmInfo] = useState({
    status: false,
    bnid: -1,
    user: "",
  });
  const [open, setOpen] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const newAudioElement = new Audio("/alarm.mp3");
    setAudioElement(newAudioElement);

    return () => {
      newAudioElement.pause();
    };
  }, []);

  const closeAlert = async () => {
    try {
      await axiosPrivate.post(
        `/beacon/update/ack?bnid=${alarmInfo.bnid}&ack=false&sos=L`
      );
    } catch (err) {
      console.log(err);
    }
    setAlarmInfo({ status: false, bnid: -1, user: "" });
  };

  function showAlert(beacon) {
    setAlarmInfo({ status: true, bnid: beacon.bnid, user: beacon.username });
  }

  useEffect(() => {
    if (alarmInfo.status) {
      setOpen(true);
      audioElement.loop = true;
      audioElement.play();
    } else {
      setOpen(false);
      audioElement?.pause();
      //   console.log("this ran");
    }
  }, [alarmInfo.status]);

  return (
    <AlarmAlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={closeAlert}
              sx={{ background: "darkred" }}
            >
              OK
            </Button>
          }
          sx={{
            background: "red",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        >
          SOS pressed by {alarmInfo.user}
        </Alert>
      </Snackbar>
    </AlarmAlertContext.Provider>
  );
};

export default AlarmAlertContext;
