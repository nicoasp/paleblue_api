const passport = require('passport');
const passportJwt = require('passport-jwt');
const { ExtractJwt } = passportJwt;
const JwtStrategy = passportJwt.Strategy;


const models = require('./../models');
const User = models.User
module.exports = app => {
  app.use(passport.initialize());
  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: process.env.JWT_SECRET
    },
    function(jwtPayload, done) {
      User.findById(jwtPayload._id)
        .then(user => {
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        })
        .catch(done);
    })
  );

  return passport;
};
