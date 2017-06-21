const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const models = {};
models.User = require("./User");
models.Content = require("./Content");
models.Like = require("./Like");
models.VerificationHash = require("./VerificationHash");
module.exports = models;
