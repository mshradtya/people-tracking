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
    gwid: {
      type: Number,
      min: 201,
      max: 250,
    },
    cpid: {
      type: Number,
      min: 101,
      max: 200,
    },
    sos: {
      type: String,
      enum: ["H", "L"],
      required: true,
    },
    idle: {
      type: String,
      enum: ["H", "L"],
      required: true,
    },
    userAck: {
      type: Boolean,
      required: true,
    },
    isInDcsRoom: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: String,
    },
    battery: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    username: {
      type: String,
      match: /^[a-zA-Z0-9]{4,}$/,
    },
    reassigned: {
      type: Boolean,
    },
    boundingBox: [{ type: Number }],
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
            beaconSchema.path("bnid").options.min
          } and ${beaconSchema.path("bnid").options.max}.`
        )
      );
    }
  }

  return next(error);
});

const Beacon = mongoose.model("Beacon", beaconSchema);

module.exports = Beacon;
