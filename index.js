const express = require("express");
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

//connect to database


//create app
const app = express();
//make the static path to the public folder
app.use(express.static('public'))
//set view engine
app.set("view engine", "ejs");
//the home page
app.route("/")
    .get((req, res) => {
        res.render("index");
    })
//listen on port 3000
app.listen(3000, () => {
    console.log("The app is running on port 3000 now.");
})