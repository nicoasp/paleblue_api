const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("../models");
const Content = models.Content;

router.get("/", (req, res) => {
  Content.find({})
    .then(contentList => {
      res.json(contentList);
    })
    .catch(err => {
      console.log(err);
      next({ status: 404, error: "Content does not exist" });
    });
});

router.post("/", (req, res) => {
  const { contentType, data, lng, lat } = req.body;

  const content = new Content();
  content.contentType = contentType;
  content.data = data;
  content.lng = lng;
  content.lat = lat;
  content.save((err, content) => {
    if (err) {
      next({ status: 400, error: "Submitted content is not valid" });
    } else {
      res.json({
        success: true,
        error: null
      });
    }
  });
});

module.exports = router;
