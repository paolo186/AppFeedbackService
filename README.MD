*** OAuth 2.0 Flow using PassportJS and Cookie-Based Authentication ***
For more details, see comments in code inside server/ folder

Authentication Flow: 
1)  User navigates to /auth/google to sign in => redirect to Google OAuth => 
    after sucessful sign in, control is passed to GoogleStrategy's callback =>
    check if MongoDB already has this user saved then return user object => 
    Passport.serializeUser() receives user object and returns serialized object based on user.id =>
    Meanwhile, serializeUser() also saves user.id in req.session.passport.user object =>
    Cookie session turns the user id into an encrypted cookie and pastes it in HTTP Header's set-cookie => 
    Send cookie back to client and this cookie will be sent in the HTTP Headers with every future requests to identify user's session is active

2)  After User has signed in, the client will have an encrypted cookie in its HTTP Headers (that shows that there is an existing session) =>
    Cookie is used in every future requests => 
    User navigates to another route =>
    Cookie-session decrypts set-cookie => 
    Passport pulls user.id out of set-cookie data  (user.id is what was serialized) =>
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