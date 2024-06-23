// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const beaconHistorySchema = new Schema({
//   date: {
//     type: String,
//     required: true,
//   },
//   bnids: [
//     {
//       bnid: {
//         type: String,
//         required: true,
//       },
//       cpids: [
//         {
//           type: String,
//           required: true,
//         },
//       ],
//     },
//   ],
// });

// const BeaconHistory = mongoose.model("BeaconHistory", beaconHistorySchema);
// module.exports = BeaconHistory;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const pathLogsSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  bnids: [
    {
      bnid: {
        type: String,
        required: true,
      },
      cpids: [
        {
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
          path: [
            {
              type: String,
              required: true,
            },
          ],
        },
      ],
    },
  ],
});

const PathLogs = mongoose.model("PathLogs", pathLogsSchema);
module.exports = PathLogs;
