const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

/* NOTE: order of require statements matter */

// Model Classes
require('./models/User');

// Passport JS Configuration
require('./services/passport');

// enable session cookies in our application (it also extracts cookie data)
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // in milliseconds
app.use(
    cookieSession({
        maxAge: THIRTY_DAYS,
        keys: [process.env.COOKIE_KEY] // used to encrypt cookie
    })
);

/* 
    register to passport to use session (to understand further, check out PassportJS's documentation on Authentication);
    After the user has signed in, Passport will then pull user id out of 
    cookie data then pass data into deserializeUser() in passport.js 
*/
app.use(passport.initialize());
app.use(passport.session());

// connect to MongoDB
mongoose.connect(
    process.env.MONGO_URI,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
);

// OAuth Routes
require('./routes/authRoutes')(app);

// start server
const PORT = process.env.PORT || 5000;
console.log("listening at port", PORT)
app.listen(PORT);