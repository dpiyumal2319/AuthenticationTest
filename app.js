require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const userName = req.body.username;
        const password = req.body.password;
        if (userName && password) {
            User.findOne({ username: userName }).then((foundUser) => {
                if (foundUser) {
                    const user = new User({
                        username: userName,
                        password: password
                    });

                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            passport.authenticate("local")(req, res, () => {
                                res.redirect("/secrets");
                            });
                        }
                    });
                } else {
                    res.render("noAccount");
                }
            });
        } else {
            res.render("fieldMissing", { redirectUrl: "/login" });
        }
    });

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        username = req.body.username;
        password = req.body.password;
        if (username && password) {
            User.findOne({ username: username }).then((user) => {
                if (user) {
                    res.render("userExists");
                } else {
                    User.register(
                        { username: req.body.username },
                        req.body.password,
                        (err, user) => {
                            if (err) {
                                console.log(err);
                                res.redirect("/register");
                            } else {
                                passport.authenticate("local")(req, res, () => {
                                    res.redirect("/secrets");
                                });
                            }
                        }
                    );
                }
            });
        } else {
            res.render("fieldMissing", { redirectUrl: "/register" });
        }
    });

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

