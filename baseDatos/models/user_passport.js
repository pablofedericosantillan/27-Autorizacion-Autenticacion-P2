/*var mongoose = require('mongoose');
 
module.exports = mongoose.model('Users',{
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
});*/


const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: { type: String, required: true, max: 100 },
    password: { type: String, required: true, max: 100 }
});

const Users = mongoose.model('Users', schema);

module.exports = Users;
