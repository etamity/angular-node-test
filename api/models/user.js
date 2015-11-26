//Create sample users data for testing.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    admin: Boolean
});


// set up a mongoose model for user
module.exports = mongoose.model('User', UserSchema);
