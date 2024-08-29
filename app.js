const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
