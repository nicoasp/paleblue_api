const express = require("express");
const app = express();
const url = require("url");
const generateToken = require("./generateToken");

const { User } = require("../models");

module.exports = passport => {
  ////
  // Login
  ////
  app.post("/api/v1/login", (req, res, next) => {
    let password = req.body.password;
    let email = req.body.email.toLowerCase();
    if (!email || !password) {
      return res.status(401).json({ error: "Missing user credentials" });
    }
    User.findOne({ email: email }, (err, user) => {
      let validPass = user.validatePassword(password);
      console.log("user", user);
      console.log("validPass", validPass);
      if (!user || !validPass) {
        return res.status(401).json({ error: "Invalid user credentials" });
      }
      let token = generateToken(user);
      console.log(token);
      return res.json({ token, user });
    });
  });

  ////
  // Register
  ////
  app.post("/api/v1/register", (req, res, next) => {
    let password = req.body.password;
    let email = req.body.email;
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be longer than 7 characters"
      });
    }
    let user = new User({ email, password });
    user.save((err, user) => {
      if (err) {
        return next(err);
      }
      let token = generateToken(user);
      return res.json({ token, user });
    });
  });

  ////
  // Authenticate Routes
  ////
  app.use("*", (req, res, next) => {
    passport.authenticate("jwt", { session: false });
    if (req.user) {
      next();
    } else {
      res.status(401).json({ error: "User not found" });
    }
  });

  return app;
};
