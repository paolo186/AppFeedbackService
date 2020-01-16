const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// with only 1 arg, this is to retrieve a collection called 'users'
const User = mongoose.model('users');

// after user login => used for set-cookie sent back to client to be used for future server requests 
passport.serializeUser((user, done) => {
  // user.id is MongoDB's auto-generated ID for the user
  done(null, user.id); // 1st arg is for errors
});

// 1st arg in callback is whatever object we serialized above (in this case, user.id)
passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  })
  .catch((error, info) => {
    console.log(error, info);
  })
});

// register GoogleStrategy to passport module; used for Google OAuth 2.0;
// registered OAuth redirect callback in Google API
// http://localhost:5000/auth/google/callback
passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    }, 
    // this callback function gets called after Passport exchanges code for an accessToken
    (accessToken, refreshToken, profile, done) => { 

      // take proper action depending on whether the user is new or existing
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // tell PassportJS to continue auth process
            done(null, existingUser); // 1st arg is for errors
          }
          else {
            // creates and saves this new User object to MongoDB
            new User({ googleId: profile.id })
              .save()
              .then(newUser => done(null, newUser))
              .catch((error, info) => {
                console.log(error, info);
              })
          }
        })
        .catch((error, info) => {
          console.log(error, info);
        })

    })
);
