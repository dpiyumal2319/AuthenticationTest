const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password,
        });

        User.findOne({
            email: req.body.username
        }).then((user) => {
            if (user) {
                res.redirect("/user-exists");
            } else {
                newUser.save().then(() => {
                    res.render("secrets");
                }
                ).catch((err) => {
                    console.log(err);
                });
            }
        });

        
    });


app.get("/user-exists", (req, res) => {
    res.render("userExists");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
