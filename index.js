const app = require("express")();
require("dotenv").config();

////
// MongoDB connection
////
const mongoose = require("mongoose");
const models = require("./models");
const User = models.User;
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    console.log('already connected to MongoDB');
    next();
  } else {
    require("./mongo")(req).then(() => {
      console.log("connected to MongoDB");
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
const morgan = require("morgan");
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("tiny"));
}

////
// Routes
////
const contentRoutes = require('./routers/content');
app.use('/api/v1/content', contentRoutes);

////
// Server
////
const port = process.env.PORT ||
  process.argv[2] ||
  3001;
const host = 'localhost';


let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

const server = require('http').createServer(app);
if (require.main === module) {
  server.listen.apply(app, args);
}

module.exports = app;

////
// Websockets
////
const io = require('socket.io')(server);  

io.on('connection', (socket) => {  
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
}





