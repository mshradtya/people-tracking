import React, { createContext, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlarmAlertContext = createContext();

export const AlarmAlertProvider = ({ children }) => {
  const [showAlarmAlert, setShowAlarmAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const newAudioElement = new Audio("/alarm.mp3");
    setAudioElement(newAudioElement);

    return () => {
      newAudioElement.pause();
    };
  }, []);

  function closeAlert() {
    setShowAlarmAlert(false);
  }

  useEffect(() => {
    if (showAlarmAlert) {
      setOpen(true);
      audioElement.loop = true;
      audioElement.play();
    } else {
      setOpen(false);
      audioElement?.pause();
      //   console.log("this ran");
    }
  }, [showAlarmAlert]);

  return (
    <AlarmAlertContext.Provider value={{ showAlarmAlert, setShowAlarmAlert }}>
      {children}
      <Snackbar
        open={open}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          SOS occured
        </Alert>
      </Snackbar>
    </AlarmAlertContext.Provider>
  );
};

export default AlarmAlertContext;
