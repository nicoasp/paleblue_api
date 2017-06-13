const app = require('express')();
require('dotenv').config();

////
// MongoDB connection
////
const mongoose = require('mongoose');
const models = require('./models');
const User = models.User;
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    console.log('connected to MongoDB');
    next();
  } else {
    require('./mongo')(req).then(() => {
      console.log('connected to MongoDB');
      next();
    });
  }
});

////
// Body Parser
////
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

////
// Passport
////
const passport = require("./lib/passport")(app);
const auth = require("./lib/auth")(passport);
app.use(auth);

////
// Morgan Logging
////
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

////
// Routes
////

////
// Server
////
const port = process.env.PORT ||
  process.argv[2] ||
  3000;
const host = 'localhost';


let args;
process.env.NODE_ENV === 'production' ?
  args = [port] :
  args = [port, host];

args.push(() => {
  console.log(`Listening: http://${ host }:${ port }\n`);
});

if (require.main === module) {
  app.listen.apply(app, args);
}

module.exports = app
