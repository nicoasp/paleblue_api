const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

let VerificationHashSchema = new Schema({
  verificationHash: { type: String },
  user: { type: Schema.Types.ObjectId },
  expires: {
    type: Date,
    default: Date.now,
    expires: process.env.VERIFICATION_EXPIRE_LENGTH || "3d"
  }
});

VerificationHashSchema.virtual("hash").set(function(value) {
  this.verificationHash = bcrypt.hashSync(
    `${value}${process.env.VERIFICATION_HASH_SECRET}`
  );
});

var VerificationHash = mongoose.model(
  "VerificationHash",
  VerificationHashSchema
);

module.exports = VerificationHash;
