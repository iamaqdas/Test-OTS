const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

const config = require("./config/database");

// establishing connection with mongo db your database with mongoose
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log('Connect to database succesfully');
});

mongoose.connection.on('error', (err) => {
    console.log('Database Error : '+err);
});

const app = express();

// Users routes you can add your own. -- can be located at ./routes/users.js
const users = require("./routes/users");

// Port number passed in listen
const port = 3000;

// cors middleware for api calls from everywhere
app.use(cors());

// body-parser middleware for parsing body-form data
app.use(bodyParser.json());

// Passport middleware for setting up json web tokens
app.use(passport.initialize());
app.use(passport.session());

// passing passport to config/passport
require("./config/passport")(passport);

// Set static folder where static view files are kept
app.use(express.static(path.join(__dirname,'public')));

// calling users routes
app.use("/users", users);

// Listening on port
app.listen(port, () => {
    console.log("Server started on port : "+port);
});

// root route will be later changed to the angular frontend 
app.get("/", (req,res)=>{
    res.send("Invalid Endpoint");
});