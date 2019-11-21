const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
// defining router to express.Router()
const router = express.Router();
// Bringing in the model can be located in models/ directory
const User = require("../models/user");

const config = require("../config/database");

// Calling actual routes these are directed fron the app js to here and returns response from here
// router.get instead of app.get as the express.Router is initialized 
// next calls the function below current function
// REGISTER route
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name : req.body.name,
        email : req.body.email,
        username : req.body.username,
        // plain password hashed vua bcryptjs function
        password : req.body.password
    });

    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success: false, message: "Failed to register user"});
        }else{
            res.json({success: true, message: "User Registered Successfully"});
        }
    })
});

// AUTHENTICATE route
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err){
            console.log(err);
        }
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err){
                console.log(err);
            }
            if(isMatch){
                // add user.toJSON() instead of user to avoid Error: Expected "payload" to be a plain object.
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // expires in 1 week
                });
                res.json({
                    success : true,
                    token : 'JWT '+token,
                    user : {
                        id : user._id,
                        username : user.username,
                        name : user.name,
                        email : user.email
                    }
                });
            }else{
                return res.json({success: false, message: "Wrong Password"});
            }
        })
    })
});

// LOGIN route
router.post('/login', (req, res, next) => {
    res.send("LOGIN");
});

// PROFILE route
router.get('/profile', passport.authenticate('jwt', {session : false}), (req, res, next) => {
    res.json({user : req.user});
});

// Export the router compulsory as it will not work in app.js unless exported
module.exports = router;