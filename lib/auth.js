const express = require("express");
const app = express();
const url = require('url');
const generateToken = require('./generateToken');

const { User } = require("../models");

module.exports = passport => {

  ////
  // Login
  ////
  app.post("/api/v1/login", (req, res, next) => {
    let email, password;

    password = req.body.password;
    if (req.body.email) {
      email = req.body.email.toLowerCase();
    }

    if (!email || !password) {
      return res.status(401).json({ error: "Missing user credentials" });
    }

    User.find({ email })
      .then(user => {
        if (!user || !user.validPassword(password)) {
          return res.status(401).json({ error: "Invalid user credentials" });
        }
        const token = generateToken(user)
        return res.json({ token, user });
      })
      .catch(next);
  });

  ////
  // Register
  ////
  app.post("/api/v1/register", (req, res, next) => {
    let body = req.body;
    if(body.password.length < 8){
      res.status(400).json({error:"Password must be longer than 7 characters"})
      return
    }
    let user = new User({
      email: body.email.trim(),
      password: body.password.trim(),
    });
    user.save(function(err, user) {
      if (err) {
        next(err);
        return;
      }
      let token = generateToken(user);
      return res.json({
        user, token
      });
    });
  });

  ////
  // Authenticate Routes
  ////
  app.use("*", (req, res, next) => {
    passport.authenticate('jwt', {session:false})
      if(req.user){
        next()
      } else {
        res.status(401).json({error:"User not found"})
      }
  })

  return app;
};
