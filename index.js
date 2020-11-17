require("dotenv").config()
const express = require("express");
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


//connect to database
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true ,useUnifiedTopology:true});
const userSchema = mongoose.Schema({
    email: String,
    password: String,
    username: String
});
const secret = "asccret";
//plug in to the schema before create the model
//encrypt the entire database if no encryptFields provided
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:["password"]});
//this determines the table name
const User = new mongoose.model("User", userSchema);
//create app
const app = express();
//use body parser to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
//make the static path to the public folder
app.use(express.static('public'))
//set view engine
app.set("view engine", "ejs");
//the home page
app.route("/")
    .get((req, res) => {
        res.render("index");
    })

app.route("/sign-up")
    .get((req, res) => {
        res.render("sign-up");
    })
    .post((req, res) => {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        });
        user.save();
        res.render("secret");
    });

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        User.findOne({ username: req.body.username }, (err,foundUser) => {
            if (err) {
                console.log("ERROR:");
                console.log(err);
            } else if (foundUser) {
                console.log("FOUND ONE USER.");
                if (foundUser.password===req.body.password) {
                    console.log("CORRECT PASSWORD");
                    res.render("secret");
                } else {
                    console.log("PASSWORD WRONG");
                    res.render("404");
                }
            } else {
                console.log("NO SUCH USERNAME");
                res.render("404");
            }

        });
    })

app.route("/contact-us")
    .get((req, res) => {
        res.render("contact");
    })

app.use((req, res, next) => {
    res.status(404);
    res.render("404");
    })
//listen on port 3000
app.listen(3000, () => {
    console.log("The app is running on port 3000 now.");
})