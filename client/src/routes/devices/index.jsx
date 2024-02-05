import React from "react";
import PropTypes from "prop-types"; // Add this import
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Wearables from "./wearables";
import Gateways from "./gateways";
import Repeaters from "./repeaters";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Devices() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="flex justify-center">
        <div
          className="bg-white w-1/3 rounded-md"
          style={{
            boxShadow:
              "-1px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
          }}
        >
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Gateways" {...a11yProps(0)} />
            <Tab label="Repeaters" {...a11yProps(1)} />
            <Tab label="Wearables" {...a11yProps(2)} />
          </Tabs>
        </div>
      </div>
      <div>
        <CustomTabPanel value={value} index={0}>
          <Gateways />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Repeaters />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Wearables />
        </CustomTabPanel>
      </div>
    </>
  );
}
