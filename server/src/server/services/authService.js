const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email not Registered");
  }
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    throw new Error("Incorrect Password");
  }

  const accessToken = jwt.sign(
    {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const _id = user._id;
  const username = user.username;
  const role = user.role;

  return { _id, username, role, accessToken, refreshToken };
};

const refresh = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return reject("Forbidden");
        }

        const { user } = decoded;

        const newUser = await User.findById(user._id);

        if (!newUser) return reject("Unauthorized");

        const accessToken = jwt.sign(
          {
            user: {
              _id: newUser._id,
              username: newUser.username,
              email: newUser.email,
              role: newUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        const _id = newUser._id;
        const username = newUser.username;
        const role = newUser.role;
        const email = newUser.email;

        resolve({ _id, username, role, email, accessToken });
      }
    );
  });
};

const authUser = async (authHeader) => {
  if (!authHeader) {
    throw new Error(`Invalid request. Please provide the auth header`);
  }
  const decodedPayload = jwt.verify(
    authHeader,
    process.env.ACCESS_TOKEN_SECRET
  );
  const userDetail = await User.findById(decodedPayload.user._id);
  return userDetail;
};

module.exports = {
  loginUser,
  authUser,
  refresh,
};
