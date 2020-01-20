const passport = require('passport');
/*
    NOTE: When using PassportJS for OAuth 2.0, two routes are required.
    User navigates to /auth/google to start the process.
    Identity Provider (e.g. Google) will redirect successful logins to 
    /auth/google/callback (this is registered in Google API's redirect URI). 
*/
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

    app.get('/logout', (req, res) => {
        req.logout();
        res.send("You're logged out.");
    });

    app.get('/api/current_user', (req, res) => {
        console.log("user=", req.user)
        res.send(req.user);
    })
}



