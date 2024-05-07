import React, { createContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const showSnackbar = (severity, message) => {
    setSnackbarState({ open: true, severity, message });
  };

  const hideSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <NotificationContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={2000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbarState.severity}
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
