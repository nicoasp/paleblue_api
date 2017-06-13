const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const models = {};
models.User = require("./User")
module.exports = models;
