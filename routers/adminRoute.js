const express = require("express");
const route = express.Router();

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
route.put('/accept', async function(req, res) {
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
    } else if(!cameraOperatorData  && !tourGuideData && !directorData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });
    }
});
//block technical
route.put('/block', async function(req, res) {
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
    } else if(!cameraOperatorData  && !tourGuideData && !directorData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });
        
    }
});
//unblock technical
route.put('/unblock', async function(req, res) {
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
    } else if(!cameraOperatorData  && !tourGuideData && !directorData) {
        res.json({
            status: 200,
            success: false,
            message: "No one with that info"
        });
        
    }
});

// get all tours
route.get("/allTours", async function(req,res){
    const toursData = await tour.find({}).populate("arabicTourGuide").populate("arabicCameraOperator")
    .populate("arabicDirector").populate("englishTourGuide").populate("englishCameraOperator")
    .populate("englishDirector").populate("italianTourGuide").populate("italianCameraOperator")
    .populate("italianDirector")
    if(toursData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:toursData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no tours"
        })
    }
})

//get all admins
route.get("/allAdmins",async function(req,res){
    const adminsData = await admin.find({})
    if(adminsData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:adminsData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no Admins"
        })
    }
})

//get all users
route.get("/allUsers",async function(req,res){
    const userData = await user.find({})
    if(userData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:userData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no users"
        })
    }
})

// get all TourGuides
route.get("/allTourGuides", async function(req,res){
    const tourGuideData = await tourGuide.find({})
    if (tourGuideData.length>0){
    res.json({
        status:400,
        message:"done",
        success:true,
        data:tourGuideData
    })
}
else{
    res.json({
        status:200,
        success:false,
        message:"there is no tour guides"
    })
}
})

// get all camera operators
route.get("/allCameraOperators", async function(req,res){
    const cameraOperatorData = await cameraOperator.find({})
    if (cameraOperatorData.length>0){
    res.json({
        status:400,
        message:"done",
        success:true,
        data:cameraOperatorData
    })
}
else{
    res.json({
        status:200,
        success:false,
        message:"there is no camera operators"
    })
}
})
route.get("/allDirectors", async function(req,res){
    const directorData = await director.find({})
    if (director.length>0){
    res.json({
        status:400,
        message:"done",
        success:true,
        data:directorData
    })
}
else{
    res.json({
        status:200,
        success:false,
        message:"there is no directors"
    })
}
})

// get all arabic tour guides , camera operators , directors
route.get("/arabicTourGuides", async function(req,res){
    const tourGuideData = await tourGuide.find({languages:{$in:["arabic"]}})
    if (tourGuideData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:tourGuideData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no arabic tour guides"
        })
    }   
})

route.get("/arabicCameraOperators", async function(req,res){
    const cameraOperatorData = await cameraOperator.find({languages:{$in:["arabic"]}})
    if (cameraOperatorData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:cameraOperatorData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no arabic camera operators"
        })
    }   
})
route.get("/arabicDierctors", async function(req,res){
    const directorData = await director.find({languages:{$in:["arabic"]}})
    if (directorData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:directorData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no arabic directors"
        })
    }   
})


// get all English tour guides , camera operators , directors
route.get("/englishTourGuides", async function(req,res){
    const tourGuideData = await tourGuide.find({languages:{$in:["english"]}})
    if (tourGuideData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:tourGuideData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no english tour guides"
        })
    }   
})
route.get("/englishCameraOperator", async function(req,res){
    const cameraOperatorData = await cameraOperator.find({languages:{$in:["english"]}})
    if (cameraOperatorData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:cameraOperatorData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no english camera operaor"
        })
    }   
})
route.get("/englishDirectors", async function(req,res){
    const directorData = await director.find({languages:{$in:["english"]}})
    if (directorData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:directorData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no english directors"
        })
    }   
})

// get all Italy tour guides , camera operators , directors
route.get("/italianoTourGuides", async function(req,res){
    const tourGuideData = await tourGuide.find({languages:{$in:["italiano"]}})
    if (tourGuideData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:tourGuideData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no italian tour guides"
        })
    }   
})
route.get("/italianoCameraOperator", async function(req,res){
    const cameraOperatorData = await cameraOperator.find({languages:{$in:["italiano"]}})
    if (cameraOperatorData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:cameraOperatorData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no italian camera operator"
        })
    }   
})
route.get("/italianoDirectors", async function(req,res){
    const directorData = await director.find({languages:{$in:["italiano"]}})
    if (directorData.length>0){
        res.json({
            status:400,
            message:"done",
            success:true,
            data:directorData
        })
    }
    else{
        res.json({
            status:200,
            success:false,
            message:"there is no italian directors"
        })
    }   
})


// add tour
route.post('/addTour',upload.array("img", 9), async function (req,res){
    const date = req.body.date;
    let multiimages = req.files.map((file) => file.filename);

    // Check if tour guides are available
    const tourGuides = [req.body.arabicTourGuide, req.body.englishTourGuide, req.body.italianTourGuide];
    for (const tourGuideId of tourGuides) {
        if (tourGuideId) {
            
            const tourGuidee = await tourGuide.findById(tourGuideId).populate("tours");
            const tourDates = tourGuidee.tours.map(tour => new Date(tour.date));
            console.log(tourDates)
            const newDate = new Date(date)
            console.log(newDate)
            for(let i =0;i<tourDates.length;i++){

                if (tourDates[i]==date) {
                    console.log("hello")
                    return res.status(400).send(`The selected tour guide is not available on ${date}.`);
                }
            }
        }
    }

     // Check if camera operators are available
     const cameraOperators = [req.body.arabicCameraOperator, req.body.englishCameraOperator, req.body.italianCameraOperator];
     for (const cameraOperatorId of cameraOperators) {
         if (cameraOperatorId) {
             const cameraOperatorr = await cameraOperator.findById(cameraOperatorId);
             const tourDates = cameraOperatorr.tours.map(tour => tour.date);
             if (tourDates.includes(date)) {
                 return res.status(400).send(`The selected camera operator is not available on ${date}.`);
             }
         }
     }


    const tourData = await tour.create({
        title:req.body.title,
        description:req.body.description,
        hours:req.body.hours,
        address:req.body.address,
        tags:req.body.tags,
        date:req.body.date,
        price:req.body.price,
        img:multiimages,
        instructions:req.body.instructions,
        arabicTourGuide:req.body.arabicTourGuide,
        englishTourGuide:req.body.englishTourGuide,
        italianTourGuide:req.body.italianTourGuide,
        arabicCameraOperator:req.body.arabicCameraOperator,
        englishCameraOperator:req.body.englishCameraOperator,
        italianCameraOperator:req.body.italianCameraOperator,
        arabicDirector:req.body.arabicDirector,
        englishDirector:req.body.englishDirector,
        italianDirector:req.body.italianDirector,
        category:req.body.category        
    })
    if(req.body.arabicTourGuide){
        const tourGuideData = await tourGuide.findByIdAndUpdate(req.body.arabicTourGuide,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.englishTourGuide){
        const tourGuideData = await tourGuide.findByIdAndUpdate(req.body.englishTourGuide,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.italianTourGuide){
        const tourGuideData = await tourGuide.findByIdAndUpdate(req.body.italianTourGuide,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.arabicCameraOperator){
        const tourGuideData = await cameraOperator.findByIdAndUpdate(req.body.arabicCameraOperator,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.englishCameraOperator){
        const tourGuideData = await cameraOperator.findByIdAndUpdate(req.body.englishCameraOperator,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.italianCameraOperator){
        const tourGuideData = await cameraOperator.findByIdAndUpdate(req.body.italianCameraOperator,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.arabicDirector){
        const tourGuideData = await director.findByIdAndUpdate(req.body.arabicDirector,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.englishDirector){
        const tourGuideData = await director.findByIdAndUpdate(req.body.englishDirector,{
            $push :{tours:tourData._id}
        })
    }
    if(req.body.italianDirector){
        const tourGuideData = await director.findByIdAndUpdate(req.body.italianDirector,{
            $push :{tours:tourData._id}
        })
    }
    res.send(tourData)
})


// get all admins
route.get("getAllAdmins", async function(req,res){
    const adminData = await admin.find({})
    res.json({
        data:adminData,
        success:true,
        message:"done",
        status:400
    })    
})

// get top 5 tour guides
route.get("/topFiveTourGuides",async function(req,res){
    const tourGuideData = await tourGuide.find().sort({ avgRate: -1 }).limit(5)
    res.send(tourGuideData)
})

// get top 5 camera operator
route.get("/topFiveCameraOperators",async function(req,res){
    const cameraOperatorData = await cameraOperator.find().sort({ avgRate: -1 }).limit(5)
    res.send(cameraOperatorData)
})

// get top 5 directors
route.get("/topFiveDirectors",async function(req,res){
    const directorData = await director.find().sort({ avgRate: -1 }).limit(5)
    res.send(directorData)
})

// get top 5 tours
route.get("/topFiveTours",async function(req,res){
    const tourData = await tour.find().sort({ avgRate: -1 }).limit(6)
    res.send(tourData)
})

// get all revenue
route.get("/allRevenue" , async function(req,res){
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
route.get("/vip",async function(req,res){
    const vipData = await tour.find({category:"vip"})
    res.send(vipData)
})
// public tours
route.get("/public",async function(req,res){
    const publicData = await tour.find({category:"public"})
    res.send(publicData)
})

// get admin by id
route.get("/oneAdmin/:id",async function(req,res){
    console.log(req.params)
    const adminData = await admin.findById(req.params.id)
    console.log(adminData)
    res.send(adminData)
}) 


// get all reviws
route.get("/allReviews", async function(req,res){
    const reviewData = await review.find({}).populate({
        path:"book",
        populate: [
        {
          path: 'tour',
          populate: {
            path: 'arabicTourGuide arabicCameraOperator arabicDirector englishTourGuide englishCameraOperator englishDirector italianTourGuide italianCameraOperator italianDirector',
          },
        },
      ],
    })
    res.send(reviewData)
})

module.exports = route;
