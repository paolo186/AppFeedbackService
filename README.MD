*** OAuth 2.0 Flow using PassportJS and Cookie-Based Authentication ***
For more details, see comments in code inside server/ folder

Authentication Flow: 
1)  User wants to sign in => redirect to Google OAuth => 
    after sucessful sign in, control is passed to GoogleStrategy's callback =>
    check if MongoDB already has this user saved then return user object => 
    Passport.serializeUser() receives user object and returns serialized object based on user.id =>
    Cookie session turns the user object into an encrypted cookie => 
    Send cookie back to client and this cookie will be sent in the HTTP Headers with every future requests

2)  After User has signed in, the client will have an encrypted cookie in its HTTP Headers =>
    Cookie is used in every future requests => 
    User navigates to another route =>
    Cookie Session extracts cookie data =>
    Passport pulls user.id out of cookie data (user.id is what was serialized) =>
    Passport passes control to deserializeUser() =>
    deserializeUser() looks for User in MongoDB based on id and returns object to authRoute call back in request object 

