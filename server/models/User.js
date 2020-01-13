// Represents User object in MongoDB
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
});

// create 'users' collection in MongoDB using userSchema
// NOTE: mongoose will only create a new 'users' collection if it doesn't already exist
mongoose.model('users', userSchema);



