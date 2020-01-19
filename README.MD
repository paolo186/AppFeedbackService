*** OAuth 2.0 Flow using PassportJS and Cookie-Based Authentication ***
For more details, see comments in code inside server/ folder

Authentication Flow: 
1)  User navigates to /auth/google to sign in => redirect to Google OAuth => 
    after sucessful sign in, control is passed to GoogleStrategy's callback =>
    check if MongoDB already has this user saved then return user object => 
    Passport.serializeUser() receives user object and returns serialized object based on user.id =>
    Meanwhile, serializeUser() also saves user.id in req.session.passport.user object =>
    Cookie session turns the user id into an encrypted cookie and pastes it in HTTP Header's set-cookie => 
    Meanwhile Cookie session creates a session via session id for this user in req.session ()
    Send cookie back to client and this cookie will be sent in the HTTP Headers with every future requests to identify user's session is active

2)  After User has signed in, the client will have an encrypted cookie in its HTTP Headers (that shows that there is an existing session) =>
    Cookie is used in every future requests => 
    User navigates to another route =>
    Cookie-session decrypts set-cookie and checks if it matches with any saved sessions in req.session => 
    Passport pulls user.id out of req.session.passport.user (user.id is what was serialized) =>
    Passport passes control to deserializeUser() =>
    deserializeUser() looks for User in MongoDB based on id and returns User object; it also attaches this User object in the 'user' property inside request object =>
    Control is passed back to route callback that the user initially navigated to.
    In this route callback, response object contains a 'user' property that contains the User object returned from deserializeUser() =>
    App execution continues on


3)  Logging Out: 
    Using PassportJS, it attaches a logout() function onto response object. 
    By invoking res.logout(), PassportJS will clear the 'user' property 
    that previously contained the User object passed back from deserializeUser()
    
*** Good Overview of Session and Cookies *** https://stackoverflow.com/questions/11142882/what-are-cookies-and-sessions-and-how-do-they-relate-to-each-other
*** More info on PassportJS's serializeUser() and deserializeUser() *** https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

*** Why serializeUser() and deserializeUser() are used? (From PassportJS)***
Sessions
In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

*** Cookie Session vs Express Session ***
TL;DR 
Cookie Session stores the actual cookie object (4KB space limit) in req.session. 
Express Session stores session id in which it would use to look up session object in an external storage.

In this application, we're making use of Cookie Session (npm package) to act as an Express middleware to handle sessions.
Cookie Session stores session data using a cookie. Once all the data in a cookie is parsed, Cookie Session stores this entire cookie in req.session. 
The caveat is that a cookie can only hold up to 4KB of data. Since we're only making of user.id, 4KB is plenty enough.

Express session handles session differently. It saves a unique session id in a storage somewhere else, in which we would need to set up.
When looking at it npm documentation, it suggests using Azure, MongoDB, and other external database. Express Session would then use this
session id to look up in an external storage for the session data. Since it's not making use of a cookie to store data, 
using this middleware doesn't have 4KB space limitation like Cookie Session.
