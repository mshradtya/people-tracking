import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  height: "100vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  backgroundColor: "transparent",
};

export default function FullscreenLayout({
  open,
  setOpen,
  handleOpen,
  handleClose,
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src="/layout.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
          <IconButton
            onClick={() => handleClose()}
            color="primary"
            sx={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
              color: "black",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <OpenInFullIcon />
          </IconButton>
        </Box>
      </Modal>
    </div>
  );
}
