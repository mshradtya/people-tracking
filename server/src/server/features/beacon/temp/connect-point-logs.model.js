const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectPointLogsSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  cpids: [
    {
      cpid: {
        type: String,
        required: true,
      },
      timestamps: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
});

const ConnectPointLogs = mongoose.model(
  "ConnectPointLogs",
  connectPointLogsSchema
);
module.exports = ConnectPointLogs;
