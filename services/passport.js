const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser( (user, done) => {
  done(null, user.id); //incoming request with cookie - User mangoose model instance ID
})

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  })
})

passport.use(
  new GoogleStrategy(
    {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },

  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(existingUser => {
      if (existingUser) {
      done(null, existingUser);
      } else {
        new User({ googleId: profile.id}) //create a new model mongoose instance
         .save()
         .then(user => done(null, user)); //second instance
      }
    });


  }
)
);
