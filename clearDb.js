const mongoose = require("mongoose");
const models = require("./models");
const User = models.User;
const Content = models.Content;
const Like = models.Like;



module.exports = () => {

  if (mongoose.connection.readyState) {
    return Promise.all([User.remove({}), Content.remove({}), Like.remove({})]);
  } else {
    return require('./../../../mongo')()
      .then(() => Promise.all([User.remove({}), Content.remove({}), Like.remove({})]));
  }
};