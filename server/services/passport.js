const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// with only 1 arg, this is to retrieve a collection called 'users'
const User = mongoose.model('users');

// after user login => used for set-cookie sent back to client to be used for future server requests 
// also sets session property in request object with user.id;
// 1st arg is based on what was returned in PassportStrategy's auth callback
passport.serializeUser((user, done) => {
  // user.id is MongoDB's auto-generated ID for the user
  done(null, user.id); // 1st arg is for errors
});

// checks session property in request object and that'll be the 1st arg (in this case user.id)
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
      /* 
        since our app is deployed in Heroku, it goes through Heroku proxy
        resulting to GoogleStrategy changing our scheme from HTTPS to HTTP.
        This is important to note since our app is deployed with HTTPS and 
        Google API's redirect uri is using HTTPS scheme (i.e. there will be redirect uri mismatch).
        A quick hack is to set proxy to true which tells Google Strategy to not 
        change the scheme if the request went through a proxy. Do note that this may
        pose a security issue with other applications.
      */
      proxy: true, 
    }, 
    // this callback function gets called after Passport exchanges code for an accessToken
    (accessToken, refreshToken, profile, done) => { 

      // take proper action depending on whether the user is new or existing
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // tell PassportJS to continue auth process
            done(null, existingUser); // 1st arg is for errors => controls is passed to serializeUser()
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
