const mongoose = require('mongoose');
const Schema = mongoose.Schema
const mongooseuniquevalidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

let UserSchema = new Schema({
  email: {type: String, isEmail: true, unique: true},
  passwordHash: {type: String},
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual('password').set(function(value) {
    this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.plugin(mongooseuniquevalidator);

var User = mongoose.model('User', UserSchema);

module.exports = User
