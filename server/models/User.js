const mongoose = require('mongoose');
const shortid = require('shortid'); // Import shortid

const { Schema } = mongoose;

const userSchema = new Schema({
    userID: {
        type: String,
        default: shortid.generate, // Generate a short ID
        unique: true, 
      },
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'consultant', 'appraiser', 'manager', 'admin'],
        default: 'user'
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
