const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const models = require("../models");
const Like = models.Like;


router.get('/', (req, res) => {
  Like.find({})
    .populate({
        path: 'contentId',
        populate: { path: 'userId' }
    })
    .then((likeList) => {
      return likeList.filter((like) => {
        return (like.contentId.userId.email == req.user.email
          && like.contentId.userId.lastActive < like.createdAt)
      })
    })
    .then((filteredList) => {
     return filteredList.filter((like) => {
      return (!like.demoId || (req.user && req.user._id === like.demoId));
     })
    })
    .then((noDemoList) => {
      return noDemoList.map((like) => {
        return {
          _id: like._id,
          contentId: like.contentId._id,
          fromUserId: like.fromUserId,
          toUserId: like.contentId.userId,
          fromLng: like.fromLng,
          fromLat: like.fromLat,
          toLng: like.contentId.lng,
          toLat: like.contentId.lat,
          createdAt: like.createdAt
        }
      })
    })
    .then((finalList) => {
      res.json(finalList);
    })
    .catch((err) => {
     	console.log(err);
    })
})

router.post('/', (req, res) => {
	const { fromUserId, fromLng, fromLat, contentId } = req.body;

  const like = new Like();
  like.fromUserId = fromUserId;
  like.fromLat = fromLat;
  like.fromLng = fromLng;
  like.contentId = contentId;

  like.save((err, like) => {
    if (err) {
      console.log("hit error")
      next({ status: 400, error: "Submitted like is not valid" });
  	} else {
      Like.findOne({ _id: like._id })
        .populate({
            path: 'contentId',
        })
        .then((populatedLike) => {
          console.log(populatedLike);
          return {
            _id: populatedLike._id,
            contentId: populatedLike.contentId._id,
            fromUserId: populatedLike.fromUserId,
            toUserId: populatedLike.contentId.userId,
            fromLng: populatedLike.fromLng,
            fromLat: populatedLike.fromLat,
            toLng: populatedLike.contentId.lng,
            toLat: populatedLike.contentId.lat,
            createdAt: populatedLike.createdAt
          }
        })
        .then((finalLike) => {
          res.json({
            error: null,
            like: finalLike
          })
        })
        .catch((err) => {
          console.log(err);
        })
  	}
  })
})


module.exports = router;
