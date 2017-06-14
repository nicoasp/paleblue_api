const express = require("express");
const app = express();

module.exports = () => {
  app.use((err, req, res, next) => {
    if (err) {
      console.log(error);
      return res.end();
    }
  });
};
