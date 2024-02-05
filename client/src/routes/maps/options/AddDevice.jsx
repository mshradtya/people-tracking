import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useMap from "@/hooks/useMap";

const options = ["Add Repeaters", "Add Gateways"];

export default function AddDevice() {
  const {
    addingRepeaters,
    setAddingRepeaters,
    addingGateways,
    setAddingGateways,
  } = useMap();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const addingDevice = addingRepeaters || addingGateways;

  const handleClick = () => {
    if (options[selectedIndex] === "Add Repeaters") {
      setAddingRepeaters((prev) => !prev);
    } else {
      setAddingGateways((prev) => !prev);
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="outlined" ref={anchorRef} aria-label="split button">
        <Button
          onClick={handleClick}
          startIcon={
            addingDevice ? <CheckCircleIcon /> : <AddCircleRoundedIcon />
          }
          color={addingDevice ? "success" : "primary"}
        >
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          onClick={addingDevice ? "" : handleToggle}
          color={addingDevice ? "success" : "primary"}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
