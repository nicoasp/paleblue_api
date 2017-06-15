const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("../models");
const Like = models.Like;


// router.get('/', (req, res) => {
//    Like.find({})
// 	   .then((likeList) => {
// 	   	res.json(contentList);
// 	   })
// 	   .catch((err) => {
// 	   	console.log(error);
// 	   })
// })

router.post('/', (req, res) => {
	const { fromUserId, fromLng, fromLat, contentId } = req.body;


  const like = new Like();
  like.fromUserId = fromUserId;
  like.fromLat = fromLat;
  like.fromLng = fromLng;
  like.contentId = contentId;

  like.save((err, like) => {
    if (err) {
      next({ status: 400, error: "Submitted like is not valid" });
  	} else {
  		res.json({
  			error: null,
        like: like
  		})
  	}
  })
})


module.exports = router;