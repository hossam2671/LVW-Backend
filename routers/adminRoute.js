const express = require("express");
const route = express.Router();
const moment = require('moment');
const cors = require("cors")
const cookieParser = require("cookie-parser");
const { ObjectId } = require('mongoose').Types;
const tourGuide = require("../models/tourGuide")
const cameraOperator = require("../models/cameraOperator")
const director = require("../models/director")
const tour = require("../models/tours")
const user = require('../models/user')
const review = require('../models/tourReview')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const multer = require("multer");
const axios = require('axios');

const admin = require("../models/admin");
const book = require("../models/book");

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
    // console.log(req.body)
    const adminData = await admin.findOne({ email: req.body.email })
    if (adminData) {
        res.json({
            status: 400,
            success: false,
            message: "Email already exist"
        })
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const adminCreate = await admin.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.json({
            status: 200,
            message: "Registered Successfully",
            success: true,
            data: adminCreate
        })
    }
})

//login

route.post('/login', async function (req, res) {
    const adminData = await admin.findOne({ email: req.body.email })
    if (!adminData) {
        res.json({
            status: 400,
            success: false,
            message: "Email not found"
        })
    } else if (!await bcrypt.compare(req.body.password, adminData.password)) {
        res.json({
            status: 400,
            success: false,
            message: "Wrong Password"
        })
    } else {
        const token = jwt.sign({ adminData: adminData._id }, "token");
        res.cookie("admin", token, { maxAge: 9000000, httpOnly: true });
        res.json({
            status: 200,
            message: "Welcome Back",
            success: true,
            data: adminData
        })
    }
})

//accept technical
route.put('/accept', async function (req, res) {
    const tourGuideData = await tourGuide.findById(req.body.id);
    const cameraOperatorData = await cameraOperator.findById(req.body.id);
    const directorData = await director.findById(req.body.id);
    if (tourGuideData) {
        const tourGuideupdated = await tourGuide.findByIdAndUpdate(req.body.id, {
            status: "accepted"
        });
        const tourGuideDataupdated = await tourGuide.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: tourGuideDataupdated,
            message: "Updated Successfully"
        });
    } else if (cameraOperatorData) {
        const cameraOperatorUpdated = await cameraOperator.findByIdAndUpdate(req.body.id, {
            status: "accepted"
        });
        const cameraOperatorDataUpdated = await cameraOperator.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: cameraOperatorDataUpdated,
            message: "Updated Successfully"
        });
    } else if (directorData) {
        const directorUpdated = await director.findByIdAndUpdate(req.body.id, {
            status: "accepted"
        });
        const directorDataUpdated = await director.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: directorDataUpdated,
            message: "Updated Successfully"
        });
    } else if (!cameraOperatorData && !tourGuideData && !directorData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });
    }
});
//block technical
route.put('/block', async function (req, res) {
    const tourGuideData = await tourGuide.findById(req.body.id);
    const cameraOperatorData = await cameraOperator.findById(req.body.id);
    const directorData = await director.findById(req.body.id);
    if (tourGuideData) {
        const tourGuideupdated = await tourGuide.findByIdAndUpdate(req.body.id, {
            status: "blocked"
        });
        const tourGuideDataupdated = await tourGuide.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: tourGuideDataupdated,
            message: "Updated Successfully"
        });
    } else if (cameraOperatorData) {
        const cameraOperatorUpdated = await cameraOperator.findByIdAndUpdate(req.body.id, {
            status: "blocked"
        });
        const cameraOperatorDataUpdated = await cameraOperator.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: cameraOperatorDataUpdated,
            message: "Updated Successfully"
        });
    } else if (directorData) {
        const directorUpdated = await director.findByIdAndUpdate(req.body.id, {
            status: "blocked"
        });
        const directorDataUpdated = await director.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: directorDataUpdated,
            message: "Updated Successfully"
        });
    } else if (!cameraOperatorData && !tourGuideData && !directorData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });

    }
});
//unblock technical
route.put('/unblock', async function (req, res) {
    const tourGuideData = await tourGuide.findById(req.body.id);
    const cameraOperatorData = await cameraOperator.findById(req.body.id);
    const directorData = await director.findById(req.body.id);
    if (tourGuideData) {
        const tourGuideupdated = await tourGuide.findByIdAndUpdate(req.body.id, {
            status: "accepted"
        });
        const tourGuideDataupdated = await tourGuide.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: tourGuideDataupdated,
            message: "Updated Successfully"
        });
    } else if (cameraOperatorData) {
        const cameraOperatorUpdated = await cameraOperator.findByIdAndUpdate(req.body.id, {
            status: "accepted"
        });
        const cameraOperatorDataUpdated = await cameraOperator.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: cameraOperatorDataUpdated,
            message: "Updated Successfully"
        });
    } else if (directorData) {
        const directorUpdated = await director.findByIdAndUpdate(req.body.id, {
            status: "accepted"
        });
        const directorDataUpdated = await director.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: directorDataUpdated,
            message: "Updated Successfully"
        });
    } else if (!cameraOperatorData && !tourGuideData && !directorData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });

    }
});

//change tour guide role
route.put('/updateTourGuide', async function (req, res) {
    const tourGuideData = await tourGuide.findById(req.body.id);
    if (tourGuideData) {
        const tourGuideupdated = await tourGuide.findByIdAndUpdate(req.body.id, {
            role: "headTourGuide"
        });
        const tourGuideDataupdated = await tourGuide.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: tourGuideDataupdated,
            message: "Updated Successfully"
        });
    } else if (!tourGuideData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });

    }
});
//change head tour guide role
route.put('/updateHeadTourGuide', async function (req, res) {
    const tourGuideData = await tourGuide.findById(req.body.id);
    if (tourGuideData) {
        const tourGuideupdated = await tourGuide.findByIdAndUpdate(req.body.id, {
            role: "tourGuide"
        });
        const tourGuideDataupdated = await tourGuide.findById(req.body.id);
        res.json({
            status: 400,
            success: true,
            data: tourGuideDataupdated,
            message: "Updated Successfully"
        });
    } else if (!tourGuideData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });

    }
});

// get all tours
route.get("/allTours", async function (req, res) {
    const toursData = await tour.find({}).populate("arabicTourGuide").populate("arabicCameraOperator")
        .populate("arabicDirector").populate("englishTourGuide").populate("englishCameraOperator")
        .populate("englishDirector").populate("italianTourGuide").populate("italianCameraOperator")
        .populate("italianDirector")
    if (toursData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: toursData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no tours"
        })
    }
})

//get all admins
route.get("/allAdmins", async function (req, res) {
    const adminsData = await admin.find({})
    if (adminsData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: adminsData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no Admins"
        })
    }
})

//get all users
route.get("/allUsers", async function (req, res) {
    const userData = await user.find({})
    if (userData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: userData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no users"
        })
    }
})

// get all TourGuides
route.get("/allTourGuides", async function (req, res) {
    const tourGuideData = await tourGuide.find({})
    if (tourGuideData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: tourGuideData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no tour guides"
        })
    }
})

// get all camera operators
route.get("/allCameraOperators", async function (req, res) {
    const cameraOperatorData = await cameraOperator.find({})
    if (cameraOperatorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: cameraOperatorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no camera operators"
        })
    }
})
route.get("/allDirectors", async function (req, res) {
    const directorData = await director.find({})
    if (director.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: directorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no directors"
        })
    }
})

// get all arabic tour guides , camera operators , directors
route.get("/arabicTourGuides", async function (req, res) {
    const tourGuideData = await tourGuide.find({ languages: { $in: ["arabic"] } })
    if (tourGuideData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: tourGuideData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no arabic tour guides"
        })
    }
})

route.get("/arabicCameraOperators", async function (req, res) {
    const cameraOperatorData = await cameraOperator.find({ languages: { $in: ["arabic"] } })
    if (cameraOperatorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: cameraOperatorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no arabic camera operators"
        })
    }
})
route.get("/arabicDierctors", async function (req, res) {
    const directorData = await director.find({ languages: { $in: ["arabic"] } })
    if (directorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: directorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no arabic directors"
        })
    }
})


// get all English tour guides , camera operators , directors
route.get("/englishTourGuides", async function (req, res) {
    const tourGuideData = await tourGuide.find({ languages: { $in: ["english"] } })
    if (tourGuideData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: tourGuideData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no english tour guides"
        })
    }
})
route.get("/englishCameraOperator", async function (req, res) {
    const cameraOperatorData = await cameraOperator.find({ languages: { $in: ["english"] } })
    if (cameraOperatorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: cameraOperatorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no english camera operaor"
        })
    }
})
route.get("/englishDirectors", async function (req, res) {
    const directorData = await director.find({ languages: { $in: ["english"] } })
    if (directorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: directorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no english directors"
        })
    }
})

// get all Italy tour guides , camera operators , directors
route.get("/italianoTourGuides", async function (req, res) {
    const tourGuideData = await tourGuide.find({ languages: { $in: ["italiano"] } })
    if (tourGuideData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: tourGuideData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no italian tour guides"
        })
    }
})
route.get("/italianoCameraOperator", async function (req, res) {
    const cameraOperatorData = await cameraOperator.find({ languages: { $in: ["italiano"] } })
    if (cameraOperatorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: cameraOperatorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no italian camera operator"
        })
    }
})
route.get("/italianoDirectors", async function (req, res) {
    const directorData = await director.find({ languages: { $in: ["italiano"] } })
    if (directorData.length > 0) {
        res.json({
            status: 400,
            message: "done",
            success: true,
            data: directorData
        })
    }
    else {
        res.json({
            status: 200,
            success: false,
            message: "there is no italian directors"
        })
    }
})


// add tour
route.post('/addTour', upload.array("images", 9), async function (req, res) {
    console.log(req.body)
    try {
        let tourGuideData, cameraOperatorData, directorData

        if (!Array.isArray(req.body.tourGuide) && req.body.tourGuide) {
            req.body.tourGuide = [req.body.tourGuide]
        }
        if (!Array.isArray(req.body.cameraOperator) && req.body.cameraOperator) {
            req.body.cameraOperator = [req.body.cameraOperator]
        }
        if (!Array.isArray(req.body.director) && req.body.director) {
            req.body.director = [req.body.director]
        }

        if (req.body.tourGuide) {
            tourGuideData = req.body.tourGuide.map((jsonString) => JSON.parse(jsonString))
        }
        if (req.body.cameraOperator) {
            cameraOperatorData = req.body.cameraOperator.map((jsonString) => JSON.parse(jsonString))
        }
        if (req.body.director) {
            directorData = req.body.director.map((jsonString) => JSON.parse(jsonString))
        }

        let arabicTourGuide, englishTourGuide, italianTourGuide;
        let arabicCameraOperator, englishCameraOperator, italianCameraOperator;
        let arabicDirector, englishDirector, italianDirector;
        if (tourGuideData) {
            for (const tourGuide of tourGuideData) {
                if (tourGuide.language === "Arabic") {
                    arabicTourGuide = tourGuide.guide;
                } else if (tourGuide.language === "English") {
                    englishTourGuide = tourGuide.guide;
                } else if (tourGuide.language === "Italiano") {
                    italianTourGuide = tourGuide.guide;
                }
            }
        }


        if (cameraOperatorData) {
            for (const cameraOperator of cameraOperatorData) {
                if (cameraOperator.language === "Arabic") {
                    arabicCameraOperator = cameraOperator.operator;
                } else if (cameraOperator.language === "English") {
                    englishCameraOperator = cameraOperator.operator;
                } else if (cameraOperator.language === "Italiano") {
                    italianCameraOperator = cameraOperator.operator;
                }
            }
        }

        if (directorData) {
            for (const director of directorData) {
                if (director.language === "Arabic") {
                    arabicDirector = director.director;
                } else if (director.language === "English") {
                    englishDirector = director.director;
                } else if (director.language === "Italiano") {
                    italianDirector = director.director;
                }
            }
        }

        const [hourss, minutess] = req.body.startTime.split(":").map(Number);
        const tourDatee = new Date(req.body.date);
        const tourStartTime = new Date(tourDatee);

        tourStartTime.setHours(hourss);
        tourStartTime.setMinutes(minutess);
        const cairoDate = moment(tourStartTime).tz('Africa/Cairo');
        const tourDuration = req.body.hours * 60 * 60 * 1000; // Convert hours to milliseconds
        const tourEndTime = new Date(tourStartTime.getTime() + tourDuration);



        const images = req.files.map((file) => file.filename);

        // Check if a tour guide is assigned to multiple language roles
        const allTourGuides = [arabicTourGuide, englishTourGuide, italianTourGuide];
        if (allTourGuides.some((guide, index) => guide && allTourGuides.indexOf(guide) !== index)) {
            return res.send(`One of the tour guides is assigned to multiple language roles.`);
        }

        // Check if a camera operator is assigned to multiple language roles
        const allCameraOperators = [arabicCameraOperator, englishCameraOperator, italianCameraOperator];
        if (allCameraOperators.some((operator, index) => operator && allCameraOperators.indexOf(operator) !== index)) {
            return res.send(`One of the camera operators is assigned to multiple language roles.`);
        }

        // Check if a director is assigned to multiple language roles
        const allDirectors = [arabicDirector, englishDirector, italianDirector];
        if (allDirectors.some((director, index) => director && allDirectors.indexOf(director) !== index)) {
            return res.send(`One of the directors is assigned to multiple language roles.`);
        }

        if (!arabicTourGuide && (arabicCameraOperator || arabicDirector)) {
            return res.send("add arabic tour guide")
        }
        else if (!arabicCameraOperator && (arabicTourGuide || arabicDirector)) {
            return res.send("add arabic Camera operator")
        }
        else if (!arabicDirector && (arabicTourGuide || arabicCameraOperator)) {
            return res.send("add arabic Director")
        }

        if (!englishTourGuide && (englishCameraOperator || englishDirector)) {
            return res.send("add english tour guide")
        }
        else if (!englishCameraOperator && (englishTourGuide || englishDirector)) {
            return res.send("add english Camera operator")
        }
        else if (!englishDirector && (englishTourGuide || englishCameraOperator)) {
            return res.send("add english Director")
        }

        if (!italianTourGuide && (italianCameraOperator || italianDirector)) {
            return res.send("add italian tour guide")
        }
        else if (!italianCameraOperator && (italianTourGuide || italianDirector)) {
            return res.send("add italian Camera operator")
        }
        else if (!italianDirector && (italianTourGuide || italianCameraOperator)) {
            return res.send("add italian Director")
        }

        const date = req.body.date;
        const newDate = new Date(date);

        let isTourGuideAvailable = true;
        const tourGuides = [arabicTourGuide, englishTourGuide, italianTourGuide];
        for (const tourGuideId of tourGuides) {
            if (tourGuideId) {
                const tourGuidee = await tourGuide.findById(tourGuideId).populate("tours");
                const tourDates = tourGuidee.tours.map(tour => new Date(tour.date));

                for (const tourDate of tourDates) {
                    if (tourDate.getTime() === newDate.getTime()) {
                        console.log("hello");
                        isTourGuideAvailable = false;
                        break;
                    }
                }
                if (!isTourGuideAvailable) {
                    break;
                }
            }
        }

        let isCameraOperatorAvailable = true;
        const cameraOperators = [arabicCameraOperator, englishCameraOperator, italianCameraOperator];
        for (const cameraOperatorId of cameraOperators) {
            if (cameraOperatorId) {
                const cameraOperatorr = await cameraOperator.findById(cameraOperatorId);
                const tourDates = cameraOperatorr.tours.map(tour => new Date(tour.date));
                if (tourDates.some(tourDate => tourDate.getTime() === newDate.getTime())) {
                    isCameraOperatorAvailable = false;
                    break;
                }
            }
        }

        let isDirectorAvailable = true;
        const directors = [arabicDirector, englishDirector, italianDirector];
        for (const directorId of directors) {
            if (directorId) {
                const directorr = await director.findById(directorId);
                const tourDates = directorr.tours.map(tour => new Date(tour.date));
                if (tourDates.some(tourDate => tourDate.getTime() === newDate.getTime())) {
                    isDirectorAvailable = false;
                    break;
                }
            }
        }

        if (!isTourGuideAvailable || !isCameraOperatorAvailable || !isDirectorAvailable) {
            const localDate = new Date(date).toLocaleString();
            return res.send(`One of the selected tour guides, camera operators, or directors is not available on ${localDate}.`);
        }
        let longitude,latitude
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${req.body.city},${req.body.address}`;
        await axios.get(apiUrl)
    .then(response => {
        if (response.data.length > 0) {
            const firstResult = response.data[0];
             latitude = parseFloat(firstResult.lat);
             longitude = parseFloat(firstResult.lon);
            } else {
                console.log('Location not found.');
            }
        })
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        if (!req.body.title) {
            return res.send("you must add title")
        }
        if (!req.body.date) {
            return res.send("you must add date")
        }
        if (!req.body.startTime) {
            return res.send("you must add time")
        }
        if (!req.body.address) {
            return res.send("you must country of the tour")
        }
        if (!req.body.city) {
            return res.send("you must the city of the tour")
        }
        if (!req.body.category) {
            return res.send("you must the category of the tour")
        }
        if (!arabicTourGuide && !englishTourGuide && !italianTourGuide) {
            return res.send("you must add at least one language for the tour")
        }

        const currentDate = new Date();
        const [hours, minutes] = req.body.startTime.split(":").map(Number);
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        console.log(currentDate)
        const tourDate = new Date(req.body.date);
        const tourData = await tour.create({
            title: req.body.title,
            description: req.body.desc,
            hours: req.body.hours,
            address: req.body.address,
            tags: req.body.tags,
            date: moment.utc(tourDate.toISOString().slice(0, 10)).tz('Africa/Cairo'),
            time: moment.utc(currentDate).tz('Africa/Cairo'),
            price: req.body.price,
            instructions: req.body.instructions,
            arabicTourGuide: arabicTourGuide,
            englishTourGuide: englishTourGuide,
            italianTourGuide: italianTourGuide,
            arabicCameraOperator: arabicCameraOperator,
            englishCameraOperator: englishCameraOperator,
            italianCameraOperator: italianCameraOperator,
            arabicDirector: arabicDirector,
            englishDirector: englishDirector,
            italianDirector: italianDirector,
            img: images,
            city: req.body.city,
            category: req.body.category,
            startTime: tourStartTime,
<<<<<<< Updated upstream
            endTime: tourEndTime,
            longitude:longitude,
            latitude:latitude
=======
            endTime: tourEndTime
>>>>>>> Stashed changes
        });

        if (arabicTourGuide) {
            const tourGuideData = await tourGuide.findByIdAndUpdate(arabicTourGuide, {
                $push: { tours: tourData._id }
            });
        }
        if (englishTourGuide) {
            const tourGuideData = await tourGuide.findByIdAndUpdate(englishTourGuide, {
                $push: { tours: tourData._id }
            });
        }
        if (italianTourGuide) {
            const tourGuideData = await tourGuide.findByIdAndUpdate(italianTourGuide, {
                $push: { tours: tourData._id }
            });
        }
        if (arabicCameraOperator) {
            const cameraOperatorData = await cameraOperator.findByIdAndUpdate(arabicCameraOperator, {
                $push: { tours: tourData._id }
            });
        }
        if (englishCameraOperator) {
            const cameraOperatorData = await cameraOperator.findByIdAndUpdate(englishCameraOperator, {
                $push: { tours: tourData._id }
            });
        }
        if (italianCameraOperator) {
            const cameraOperatorData = await cameraOperator.findByIdAndUpdate(italianCameraOperator, {
                $push: { tours: tourData._id }
            });
        }
        if (arabicDirector) {
            const directorData = await director.findByIdAndUpdate(arabicDirector, {
                $push: { tours: tourData._id }
            });
        }
        if (englishDirector) {
            const directorData = await director.findByIdAndUpdate(englishDirector, {
                $push: { tours: tourData._id }
            });
        }
        if (italianDirector) {
            const directorData = await director.findByIdAndUpdate(italianDirector, {
                $push: { tours: tourData._id }
            });
        }
        res.send(tourData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating tour: " + error.message);
    }
});




// get all admins
route.get("getAllAdmins", async function (req, res) {
    const adminData = await admin.find({})
    res.json({
        data: adminData,
        success: true,
        message: "done",
        status: 400
    })
})

// get top 5 tour guides
route.get("/topFiveTourGuides", async function (req, res) {
    const tourGuideData = await tourGuide.find().sort({ avgRate: -1 }).limit(5)
    res.send(tourGuideData)
})

// get top 5 camera operator
route.get("/topFiveCameraOperators", async function (req, res) {
    const cameraOperatorData = await cameraOperator.find().sort({ avgRate: -1 }).limit(5)
    res.send(cameraOperatorData)
})

// get top 5 directors
route.get("/topFiveDirectors", async function (req, res) {
    const directorData = await director.find().sort({ avgRate: -1 }).limit(5)
    res.send(directorData)
})

// get top 5 tours
route.get("/topFiveTours", async function (req, res) {
    const tourData = await tour.find().sort({ avgRate: -1 }).limit(6)
    res.send(tourData)
})

// get all revenue
route.get("/allRevenue", async function (req, res) {
    const bookData = await book.aggregate([
        {
            $group: {
                _id: null,
                totalPrice: { $sum: '$price' },
            },
        },
    ]);
    if (bookData.length > 0) {
        res.json(bookData[0].totalPrice);
    }
})

// vip tours
route.get("/vip", async function (req, res) {
    const vipData = await tour.find({ category: "vip" })
    res.send(vipData)
})
// public tours
route.get("/public", async function (req, res) {
    const publicData = await tour.find({ category: "public" })
    res.send(publicData)
})

// get admin by id
route.get("/oneAdmin/:id", async function (req, res) {
    console.log(req.params)
    const adminData = await admin.findById(req.params.id)
    console.log(adminData)
    res.send(adminData)
})


// get all reviws
route.get("/allReviews", async function (req, res) {
    const reviewData = await review
        .find({})
        .populate({
            path: 'book',
            populate: [
                {
                    path: 'tour',
                    populate: {
                        path: 'arabicTourGuide arabicCameraOperator arabicDirector englishTourGuide englishCameraOperator englishDirector italianTourGuide italianCameraOperator italianDirector',
                    },
                },
                {
                    path: 'user',
                },
            ],
        });

    res.send(reviewData);
})

//addd admin
route.post("/addAdmin", async function (req, res) {
    const adminData = await admin.findOne({ email: req.body.email })
    if (adminData) {
        res.json({
            status: 400,
            success: false,
            message: "Email already exist"
        })
    } else {
        console.log("Request Body:", req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const adminCreate = await admin.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        })
        res.json({
            status: 200,
            message: "Added Successfully",
            success: true,
            data: adminCreate
        })
    }
})

// add tour guide
route.post("/addTourGuide", upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'license', maxCount: 1 }]), async function (req, res) {
    const tourGuideData = await tourGuide.findOne({ email: req.body.email })
    if (tourGuideData) {
        res.json({
            status: 400,
            success: false,
            message: "Email already exist"
        })
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const tourGuideCreate = await tourGuide.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            cv: req.files.cv[0].filename,
            license: req.files.license[0].filename,
            status: "accepted"
        })
        res.json({
            status: 200,
            message: "Added Successfully",
            success: true,
            data: tourGuideCreate
        })
    }
})

// add camera operator
route.post("/addCameraOperator", upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'license', maxCount: 1 }]), async function (req, res) {
    const cameraOperatorData = await cameraOperator.findOne({ email: req.body.email })
    if (cameraOperatorData) {
        res.json({
            status: 400,
            success: false,
            message: "Email already exist"
        })
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const cameraOperatorCreate = await cameraOperator.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            // role: req.body.role,
            cv: req.files.cv[0].filename,
            license: req.files.license[0].filename,
            status: "accepted"
        })
        res.json({
            status: 200,
            message: "Added Successfully",
            success: true,
            data: cameraOperatorCreate
        })
    }
})

// add director
route.post("/addDirector", upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'license', maxCount: 1 }]), async function (req, res) {
    const directorData = await cameraOperator.findOne({ email: req.body.email })
    if (directorData) {
        res.json({
            status: 400,
            success: false,
            message: "Email already exist"
        })
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const directorCreate = await director.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            // role: req.body.role,
            cv: req.files.cv[0].filename,
            license: req.files.license[0].filename,
            status: "accepted"
        })
        res.json({
            status: 200,
            message: "Added Successfully",
            success: true,
            data: directorCreate
        })
    }
})

module.exports = route;
