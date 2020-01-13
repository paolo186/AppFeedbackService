const passport = require('passport');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send("Welcome to isurveyu");
    })
    
    // entry point to start OAuth 2.0 flow
    app.get(
        '/auth/google', 
        passport.authenticate('google', {
          scope: ['profile', 'email']
        })
    );
    
    // registered redirect URI (callback) to exchange code for an accessToken;
    // calls callback function registered in Google Strategy (2nd argument)
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
    ); 
}



