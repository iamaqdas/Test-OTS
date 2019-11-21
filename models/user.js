const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");


// user schema for collection == table in mysql
const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
//,     // created_at:{
    //     type : Date,
    //     default : Date.now
    // }
});

// Making the user model accessible from outside of this file
const User = module.exports = mongoose.model('user', UserSchema);

// exporting functions using module.exports.functionname


// get user by ID function
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

// Get user by username function
module.exports.getUserByUsername = function(username, callback){
    // query similar to select all from where in mysql
    // in mongodb use {fieldname : variable/value}
    const query = {username : username}
    User.findOne(query, callback);
}

// Adding new user function call back done in routes
module.exports.addUser = function(newUser, callback){
    // genSalt generates salt or error if any
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
                console.log(err);
            }
            // Saving hash password
            newUser.password = hash;
            // Creating New user
            newUser.save(callback);
        });
    });
}


// Compare passwords function
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err){
            console.log(err);
        }
        callback(null, isMatch);
    });
}