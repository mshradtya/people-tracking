import React from "react";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery20Icon from "@mui/icons-material/Battery20";
import Battery30Icon from "@mui/icons-material/Battery30";
import Battery50Icon from "@mui/icons-material/Battery50";
import Battery60Icon from "@mui/icons-material/Battery60";
import Battery80Icon from "@mui/icons-material/Battery80";
import Battery90Icon from "@mui/icons-material/Battery90";

const BatteryIcon = ({ battery }) => {
  let IconComponent;

  if (battery > 0 && battery <= 10) {
    IconComponent = Battery0BarIcon;
  } else if (battery > 10 && battery <= 20) {
    IconComponent = Battery20Icon;
  } else if (battery > 20 && battery <= 30) {
    IconComponent = Battery20Icon;
  } else if (battery > 30 && battery <= 40) {
    IconComponent = Battery30Icon;
  } else if (battery > 40 && battery <= 50) {
    IconComponent = Battery50Icon;
  } else if (battery > 50 && battery <= 60) {
    IconComponent = Battery50Icon;
  } else if (battery > 60 && battery <= 70) {
    IconComponent = Battery60Icon;
  } else if (battery > 70 && battery <= 80) {
    IconComponent = Battery60Icon;
  } else if (battery > 80 && battery <= 90) {
    IconComponent = Battery80Icon;
  } else if (battery > 90 && battery <= 100) {
    IconComponent = Battery90Icon;
  }

  if (IconComponent) {
    return <IconComponent style={{ color: getColor(battery) }} />;
  } else {
    return null;
  }
};

const getColor = (battery) => {
  if (battery <= 30) {
    return "red";
  } else if (battery <= 60) {
    return "orange";
  } else {
    return "green";
  }
};

export default BatteryIcon;
