const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Passport JS Configuration
require('./services/passport');

// OAuth Routes
require('./routes/authRoutes')(app);

// Model Classes
require('./models/User');

// connect to MongoDB
mongoose.connect(
    process.env.MONGO_URI,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
);


// start server
const PORT = process.env.PORT || 5000;
console.log("listening at port", PORT)
app.listen(PORT);