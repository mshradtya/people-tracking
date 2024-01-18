const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 32,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 32,
      minLength: 6,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 256,
      match:
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()-+]).{8,256}$/,
    },
    role: {
      type: String,
      required: true,
      enum: ["SuperAdmin", "User"],
      default: "User",
    },
    dateRegistered: {
      type: String,
      required: true,
      default: Date.now,
    },
    // departments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Department",
    //   },
    // ],
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  const user = this;
  const lowercaseUsername = user.username.toLowerCase();
  user.username = lowercaseUsername;

  if (user.isModified("password") && user.password.length < 257) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  next();
});

userSchema.post("save", function (error, doc, next) {
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

  if (error.errors.password) {
    if (error.errors.password.kind === "required") {
      return next(new Error(`Password is required.`));
    }
    if (error.errors.password.kind === "maxlength") {
      return next(new Error(`Password cannot be more than 256 characters.`));
    }
    if (error.errors.password.kind === "minlength") {
      return next(new Error(`Password cannot be less than 8 characters.`));
    }
    if (error.errors.password.kind === "regexp") {
      return next(
        new Error(
          `Password must meet all the following requirements: Password must not contain any whitespaces. Password must contain at least one uppercase letter. Password must contain at least one lowercase letter. Password must contain at least one digit. Password must contain at least one special character. Password must be 8-256 characters long.`
        )
      );
    }
  }

  if (error.errors.role) {
    if (error.errors.role.kind === "required") {
      return next(new Error(`Role is required.`));
    }
    if (error.errors.role.kind === "enum") {
      return next(
        new Error(`Role can only be assigned as either SuperAdmin or User.`)
      );
    }
  }

  return next(error);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
