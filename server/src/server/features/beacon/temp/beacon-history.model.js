const mongoose = require("mongoose");
const { Schema } = mongoose;

const beaconHistorySchema = new Schema({
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
          type: String,
          required: true,
        },
      ],
    },
  ],
});

const BeaconHistory = mongoose.model("BeaconHistory", beaconHistorySchema);
module.exports = BeaconHistory;
