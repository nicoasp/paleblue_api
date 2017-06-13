const mongoose = require('mongoose');
const Schema = mongoose.Schema


let ContentSchema = new Schema({
  lng: {type: Number},
  lat: {type: Number},
  contentType: {type: String},
  data: {type: String},
});

var Content = mongoose.model('Content', ContentSchema);

module.exports = Content