const mongoose = require("mongoose");

const beaconSosHistorySchema = new mongoose.Schema(
  {
    bnid: {
      type: Number,
    },
    gwid: {
      type: Number,
    },
    cpid: {
      type: Number,
    },
    location: {
      type: String,
    },
    timestamp: {
      type: String,
    },
    username: {
      type: String,
    },
  },
  { versionKey: false }
);

beaconSosHistorySchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    // Handle duplicate gwid error
    if (error.keyPattern && error.keyPattern.bnid) {
      return next(
        new Error(`A beacon with the id '${doc.bnid}' already exists.`)
      );
    }
  }

  if (error.errors && error.errors.bnid) {
    if (error.errors.bnid.kind === "required") {
      return next(new Error(`beacon id is required.`));
    }
    if (error.errors.bnid.kind === "Number") {
      return next(new Error(`Beacon ID must be a valid number.`));
    }
    if (error.errors.bnid.kind === "min" || error.errors.bnid.kind === "max") {
      return next(
        new Error(
          `Beacon ID must be between ${
            beaconSosHistorySchema.path("bnid").options.min
          } and ${beaconSosHistorySchema.path("bnid").options.max}.`
        )
      );
    }
  }

  return next(error);
});

const SosHistory = mongoose.model("SosHistory", beaconSosHistorySchema);

module.exports = SosHistory;
