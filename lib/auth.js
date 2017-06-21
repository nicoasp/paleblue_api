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
      return next({ status: 401, error: "Missing user credentials" });
    }
    User.findOne({ email: email }, (err, user) => {
      if (user === null) {
        return next({ status: 401, error: "User not found" });
      }
      let validPass = user.validatePassword(password);
      if (!user || !validPass) {
        return next({ status: 401, error: "Invalid user credentials" });
      }
      let token = generateToken(user);
      return res.json({ token, _id: user._id });
    });
  });

  ////
  // Register
  ////
  app.post("/api/v1/register", (req, res, next) => {
    const { email, password } = req.body;
    if (password.length < 8) {
      return next({
        status: 400,
        error: "Password must be 8 characters or longer"
      });
    }
    let user = new User({ email, password });
    user.save((err, user) => {
      if (err) {
        return next({
          status: 401,
          error: "User could not be created"
        });
      }
      let token = generateToken(user);
      return res.json({ token, _id: user._id });
    });
  });


  ////
  // get Content
  ////
  const models = require('../models');
  const Content = models.Content;

  app.get('/api/v1/content', (req, res) => {
    let now = Date.now();
    now -= 12 * 60 * 60 * 1000;
    now = new Date(now);
    Content.find({ createdAt: { $gte: now } })
	    .then((contentList) => {
	   	 return contentList.filter((content) => {
        return (!content.demoId || (req.user && req.user._id === content.demoId));
       })
	    })
      .then((filteredList) => {
        res.json(filteredList);
      })
	    .catch((err) => {
	   	 console.log(error);
	    })
    })


  ////
  // Authenticate Routes
  ////
  app.use(
    "*",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      if (req.user) {
        return next();
      } else {
        return res.status(401).json({ error: "User not found" });
      }
    }
  );

  return app;
};
