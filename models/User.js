const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseuniquevalidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt-nodejs");

let UserSchema = new Schema({
  email: { type: String, isEmail: true, unique: true },
  passwordHash: { type: String },
  lastActive: { type: Date, default: Date.now },
  demoId: { type: String, default: "" },
  expires: {
    type: Date,
    default: Date.now,
    expires: process.env.VERIFICATION_EXPIRE_LENGTH || "3d"
  }
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value);
});

UserSchema.plugin(mongooseuniquevalidator);

var User = mongoose.model("User", UserSchema);

module.exports = User;
