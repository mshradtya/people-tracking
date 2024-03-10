const mongoose = require("mongoose");

const beaconSchema = new mongoose.Schema(
  {
    bnid: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 50,
    },
    gateway: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gateway",
      required: true,
    },
    sos: {
      type: String,
      enum: ["H", "L"],
      required: true,
    },
    battery: {
      type: Number,
      required: true,
      min: 10,
      max: 100,
    },
  },
  { versionKey: false }
);

beaconSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    // Handle duplicate gwid error
    if (error.keyPattern && error.keyPattern.bnid) {
      return next(
        new Error(`A beacon with the id '${doc.bnid}' already exists.`)
      );
    }
  }

  if (error.errors.bnid) {
    if (error.errors.bnid.kind === "required") {
      return next(new Error(`beacon id is required.`));
    }
    if (error.errors.bnid.kind === "Number") {
      return next(new Error(`Beacon ID must be a valid number.`));
    }
    if (error.errors.bnid.kind === "min" || error.errors.bnid.kind === "max") {
      return next(
        new Error(
          `Beacon ID must be between ${beaconSchema.obj.bnid.min} and ${beaconSchema.obj.bnid.max}.`
        )
      );
    }
  }

  return next(error);
});

const Beacon = mongoose.model("Beacon", beaconSchema);

module.exports = Beacon;
