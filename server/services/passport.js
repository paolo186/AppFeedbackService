const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
      console.log('accessToken=', accessToken);
      console.log('refreshToken=', refreshToken);
      console.log('profile=', profile);
    })
);
