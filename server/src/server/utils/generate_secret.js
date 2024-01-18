const crypto = require("crypto");

function generateAccessTokenSecret() {
  const buffer = crypto.randomBytes(32);
  const secret = buffer.toString("hex");
  return secret;
}

const accessTokenSecret = generateAccessTokenSecret();
console.log("Access Token Secret:", accessTokenSecret);
