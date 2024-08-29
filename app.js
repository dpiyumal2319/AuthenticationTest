import ejs from "ejs";
import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
