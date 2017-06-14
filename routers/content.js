const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const models = require('../models');
const Content = models.Content;

router.get('/', (req, res) => {
   Content.find({})
	   .then((contentList) => {
	   	res.json(contentList);
	   })
	   .catch((err) => {
	   	console.log(error);
	   })
})

router.post('/', (req, res) => {
	const { contentType, data, lng, lat, userId } = req.body;

  const content = new Content();
  content.userId = userId;
  content.contentType = contentType;
  content.data = data;
  content.lng = lng;
  content.lat = lat;
  content.save((err, content) => {
  	if (err) {
  		res.json({
  			error: err,
        content: null
  		})
  	} else {
  		res.json({
  			error: null,
        content: content
  		})  		
  	}
  })
})

module.exports = router;