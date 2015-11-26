// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Attempt', new Schema({
    ip: String,
    datetime: {
        type: Date,
        default: (new Date).getTime()
    },
    action: String,
    username: String
}));
