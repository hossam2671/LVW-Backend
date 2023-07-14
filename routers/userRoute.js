const express = require("express");
const route = express.Router();

const cors = require("cors")
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongoose').Types;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const multer = require("multer");

const user = require('../models/user')

route.use(express.static(path.join(__dirname, "./uploads")));
route.use(express.static("./uploads"));

route.use(cors())

const fileStorage = multer.diskStorage({
    destination: (req, file, callbackfun) => {
        callbackfun(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname.replaceAll(" ", ""));
    },
});
const upload = multer({ storage: fileStorage });

//register

route.post('/register', async function (req, res) {
    if (req.body.radio == "user") {
        const userData = await user.findOne({ email: req.body.email })
        if (userData) {
            res.json({
                status: 400,
                success: false,
                message: "Email already exist"
            })
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;

            const userCreate = await user.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            res.json({
                status: 200,
                message: "Registered Successfully",
                success: true,
                data: userCreate
            })
        }
    }
})

//login

route.post('/login', async function (req, res) {
    const userData = await user.findOne({ email: req.body.email });
    if (!userData) {
        res.json({
            status: 400,
            success: false,
            message: "Email not found"
        });
    } else if (!await bcrypt.compare(req.body.password, userData.password)) {
        res.json({
            status: 400,
            success: false,
            message: "Wrong Password"
        });
    } else {
        const token = jwt.sign({ userData: userData._id }, "token");
        res.cookie("user", token, { maxAge: 9000000, httpOnly: true });
        res.json({
            status: 200,
            message: "Welcome Back",
            success: true,
            data: userData
        });
    }
});





module.exports = route;
