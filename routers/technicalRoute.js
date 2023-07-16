const express = require("express");
const route = express.Router();

const cors = require("cors")
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongoose').Types;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const multer = require("multer");
const tourGuide = require("../models/tourGuide")
const cameraOperator = require("../models/cameraOperator")
const director = require("../models/director")

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

route.post("/register", upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'license', maxCount: 1 }]), async function (req, res) {
    console.log(req.files)
    const tourGuideData = await tourGuide.findOne({ email: req.body.email })
    const cameraOperatorData = await cameraOperator.findOne({ email: req.body.email })
    const directorData = await director.findOne({ email: req.body.email })

    // console.log(tourGuideData , cameraOperatorData , directorData)
    if (tourGuideData || cameraOperatorData || directorData) {
        res.json({
            status: 400,
            message: "email already exist",
            success: false,
        })
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        if (req.body.radio == "tourGuide") {
            const tourGuideCreate = await tourGuide.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                cv: req.files.cv[0].filename,
                license: req.files.license[0].filename
            })
            res.json({
                status: 200,
                message: "Registered Successfully",
                success: true,
                data: tourGuideCreate
            })
        } else if (req.body.radio == "cameraOperator") {
            const camerOperatoCreate = await cameraOperator.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                cv: req.files.cv[0].filename,
                license: req.files.license[0].filename
            })
            res.json({
                status: 200,
                message: "Registered Successfully",
                success: true,
                data: camerOperatoCreate
            })
        } else if (req.body.radio == "director") {
            const directorCreate = await director.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                cv: req.files.cv[0].filename,
                license: req.files.license[0].filename
            })
            res.json({
                status: 200,
                message: "Registered Successfully",
                success: true,
                data: directorCreate
            })
        }
    }
})

//login

route.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const tourGuideData = await tourGuide.findOne({ email });
        const cameraOperatorData = await cameraOperator.findOne({ email });
        const directorData = await director.findOne({ email });

        if (!tourGuideData && !cameraOperatorData && !directorData) {
            res.json({
                status: 400,
                success: false,
                message: "Email doesn't exist"
            });
        } else {
            let userData;
            let user;

            if (tourGuideData) {
                userData = tourGuideData;
                user = "tourGuide"
            } else if (cameraOperatorData) {
                userData = cameraOperatorData;
                user = "cameraOperator"
            } else if (directorData) {
                userData = directorData;
                user = "director"
            }

            const isPasswordCorrect = await bcrypt.compare(password, userData.password);

            if (!isPasswordCorrect) {
                res.json({
                    status: 400,
                    success: false,
                    message: "Incorrect Password"
                });
            } else {
                if (userData.status === 'pending') {
                    res.json({
                        status: 400,
                        success: false,
                        message: "You are still pending, come back another time"
                    });
                } else {
                    const token = jwt.sign({ userData: userData._id }, "token");
                    res.cookie(user, token, { maxAge: 9000000, httpOnly: true });
                    res.json({
                        status: 200,
                        success: true,
                        message: "Welcome with us",
                        data: userData,
                        user: user,

                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            success: false,
        });
    }
});

 //add language
 route.put("/addLang", async (req, res) => {
    const tourGuideData = await tourGuide.findById(req.body.id);
    const cameraOperatorData = await cameraOperator.findById(req.body.id);
    const directorData = await director.findById(req.body.id);

    if (tourGuideData) {
        if (tourGuideData.languages.includes(req.body.lang)) {
            res.json({
                status: 200,
                data: tourGuideData,
                success: false,
                message: "This language already exists."
            });
        } else {
            const tourGuideUpdated = await tourGuide.findByIdAndUpdate(
                req.body.id,
                { $push: { languages: req.body.lang } },
                { new: true }
            );
            res.json({
                status: 400,
                message: `${req.body.lang} added successfully.`,
                success: true,
                data: tourGuideUpdated
            });
        }
    } else if (cameraOperatorData) {
        if (cameraOperatorData.languages.includes(req.body.lang)) {
            res.json({
                status: 200,
                data: cameraOperatorData,
                success: false,
                message: "This language already exists."
            });
        } else {
            const cameraOperatorUpdated = await cameraOperator.findByIdAndUpdate(
                req.body.id,
                { $push: { languages: req.body.lang } },
                { new: true }
            );
            res.json({
                status: 400,
                message: `${req.body.lang} added successfully.`,
                success: true,
                data: cameraOperatorUpdated
            });
        }
    } else if (directorData) {
        if (directorData.languages.includes(req.body.lang)) {
            res.json({
                status: 200,
                data: directorData,
                success: false,
                message: "This language already exists."
            });
        } else {
            const directorUpdated = await director.findByIdAndUpdate(
                req.body.id,
                { $push: { languages: req.body.lang } },
                { new: true }
            );
            res.json({
                status: 400,
                message: `${req.body.lang} added successfully.`,
                success: true,
                data: directorUpdated
            });
        }
    }
});


//get one tour guide by id
route.get("getOneTourGuide",async function(req,res){
    const tourGuideData = await tourGuide.findById(req.body.id)
    res.json({
        data:tourGuideData,
        success:true,
        message:"done",
        status:400
    })    
})

//get one camera operator by id
route.get("getOneCameraOperator",async function(req,res){
    const cameraOperatorData = await cameraOperator.findById(req.body.id)
    res.json({
        data:cameraOperatorData,
        success:true,
        message:"done",
        status:400
    })    
})

//get one director by id
route.get("getOneCameraOperator",async function(req,res){
    const cameraOperatorData = await cameraOperator.findById(req.body.id)
    res.json({
        data:cameraOperatorData,
        success:true,
        message:"done",
        status:400
    })    
})


  



module.exports = route;
