const express = require("express");
const router = express.Router();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const md5 = require('md5');

const mongoose = require("mongoose");
const models = require("../models");
const Content = models.Content;


router.post('/', (req, res, next) => {
	const { contentType, data, lng, lat, userId } = req.body;

  const content = new Content();
  content.userId = userId;
  content.contentType = contentType;
  content.data = data;
  content.lng = lng;
  content.lat = lat;
  content.save((err, content) => {
    if (err) {
      next({ status: 400, error: "Submitted content is not valid" });
  	} else {
  		res.json({
  			error: null,
        content: content
  		})
  	}
  })
});

router.get('/sign-s3', (req, res, next) => {
	const { fileName, fileType } = req.query;

	const hashedFileName = `${md5(Date.now())}-${fileName}`;

	const s3Params = {
		Bucket: process.env.AWS_S3_BUCKET,
		Key: fileName,
		ContentType: fileType,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if (err) {
			console.error(err);
			next({ status: 400, error: "Error creating S3 signed URL"});
		} else {
			res.json({
				signedRequest: data,
				url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`
			});
		}
	})
});

module.exports = router;
