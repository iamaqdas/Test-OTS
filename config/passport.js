const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config/database");

// Exporting function 
module.exports = function(passport){
    let opts = {};
    // use fromAuthHeaderWithScheme("jwt") instead of fromAuthHeader as it is deprecated
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload); this was to counteract a passport error where it should be jwt_payload.sub
        // But apparently that doesn't work
        User.getUserById(jwt_payload._id, (err, user) => {
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        })
    }));
}