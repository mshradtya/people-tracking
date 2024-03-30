const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const beaconUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 32,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    designation: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      maxLength: 32,
      minLength: 6,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    phone: {
      type: Number,
    },
    dateRegistered: {
      type: String,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false }
);

beaconUserSchema.pre("save", async function (next) {
  const user = this;
  const lowercaseUsername = user.username.toLowerCase();
  user.username = lowercaseUsername;
  next();
});

beaconUserSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern && error.keyPattern.username) {
      return next(
        new Error(`A user with the username '${doc.username}' already exists.`)
      );
    } else if (error.keyPattern && error.keyPattern.email) {
      return next(
        new Error(`A user with the email '${doc.email}' already exists.`)
      );
    }
  }

  if (error.errors.username) {
    if (error.errors.username.kind === "required") {
      return next(new Error(`Username is required.`));
    }
    if (error.errors.username.kind === "maxlength") {
      return next(new Error(`Username cannot be more than 32 characters.`));
    }
  }

  if (error.errors.designation) {
    if (error.errors.designation.kind === "required") {
      return next(new Error(`Designation is required.`));
    }
  }

  if (error.errors.email) {
    if (error.errors.email.kind === "required") {
      return next(new Error(`Email is required.`));
    }
    if (error.errors.email.kind === "maxlength") {
      return next(new Error(`Email cannot be more than 32 characters.`));
    }
    if (error.errors.email.kind === "minlength") {
      return next(new Error(`Email cannot be less than 6 characters.`));
    }
    if (error.errors.email.kind === "regexp") {
      return next(new Error(`Email is not valid. Please enter a valid email.`));
    }
  }

  // if (error.errors.phone) {
  //   if (error.errors.phone.kind === "min") {
  //     return next(new Error(`Phone Number must be of 10 digits.`));
  //   }
  //   if (error.errors.phone.kind === "max") {
  //     return next(new Error(`Phone Number must be of 10 digits.`));
  //   }
  // }

  return next(error);
});

const BeaconUser = mongoose.model("BeaconUser", beaconUserSchema);
module.exports = BeaconUser;
