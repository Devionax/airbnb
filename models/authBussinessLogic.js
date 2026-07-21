const mongoose = require("mongoose");


const authenticationSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    userMail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true},
    userRole: {type: String, required: true, enum: ['host', 'guest']},

},{timestamps: true})


module.exports = mongoose.model("Users", authenticationSchema);