import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import Paper from "@mui/material/Paper";
import { Circle } from "rc-progress";
import CountUp from "react-countup";

export default function InfoCard({ title, count }) {
  return (
    <Paper elevation={2}>
      <div className="flex justify-between">
        <div className="ml-7 mt-5">
          <PersonIcon fontSize="large" />
        </div>
        <div className="mr-5 mt-5 ">
          <Circle
            percent={77}
            strokeWidth={10}
            trailWidth={8}
            strokeColor="rgb(2, 132, 199)"
            trailColor="#B3A4F3"
          />
        </div>
      </div>
      <div className="pl-7 py-5">
        <div className="text-blue-600 font-semibold">{title.toUpperCase()}</div>
        <div className="text-3xl font-semibold">
          <CountUp start={0} end={count} delay={0} />
        </div>
      </div>
    </Paper>
  );
}

// import React from "react";
// import PersonIcon from "@mui/icons-material/Person";
// import Paper from "@mui/material/Paper";
// import { Circle } from "rc-progress";
// import CountUp from "react-countup";
// import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
// import BusinessIcon from "@mui/icons-material/Business";

// export default function InfoCard({ title, count, bg, iconType }) {
//   const iconMap = {
//     user: <PersonIcon fontSize="large" sx={{ fontSize: "50px", m: "5px" }} />,
//     device: <PersonIcon fontSize="large" sx={{ fontSize: "50px", m: "5px" }} />,
//     deviceActive: (
//       <NetworkWifiIcon fontSize="large" sx={{ fontSize: "50px", m: "5px" }} />
//     ),
//     department: (
//       <BusinessIcon fontSize="large" sx={{ fontSize: "50px", m: "5px" }} />
//     ),
//   };

//   const bgMap = {
//     red: "bg-red-200",
//     green: "bg-green-200",
//     blue: "bg-blue-200",
//   };

//   return (
//     <Paper elevation={2}>
//       <div className={`flex justify-left items-center ${bgMap[bg]}`}>
//         <div className="pt-8 pb-8 pl-5">
//           <div className="bg-white rounded-full">{iconMap[iconType]}</div>
//         </div>
//         <div className="pl-5">
//           <div className="text-gray-600 text-sm font-semibold">
//             {title.toUpperCase()}
//           </div>
//           <div className="text-3xl font-semibold">
//             {" "}
//             <CountUp start={0} end={count} delay={0} />
//           </div>
//         </div>
//       </div>
//     </Paper>
//   );
// }
