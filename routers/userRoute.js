const express = require("express");
const route = express.Router();
const { ObjectId } = require('mongoose').Types;
const cors = require("cors")
const cookieParser = require("cookie-parser");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const multer = require("multer");
const book = require('../models/book')
const tour = require('../models/tours')
const user = require('../models/user')
const review = require('../models/tourReview')
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

route.post('/register', async function (req, res) {
    console.log("Received data:", req.body);
    try {
        if (req.body.userType == "user") {
            console.log("test inside");
            const userData = await user.findOne({ email: req.body.email });
            if (userData) {
                res.json({
                    status: 400,
                    success: false,
                    message: "Email already exist"
                });
            } else {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                req.body.password = hashedPassword;

                const userCreate = await user.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                });
                console.log(userCreate);
                res.json({
                    status: 200,
                    success: true,
                    message: "User created successfully",
                    data:userCreate
                });
            }
        } else {
            res.json({
                status: 400,
                success: false,
                message: "Invalid user type"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: 500,
            success: false,
            message: "An error occurred"
        });
    }
});

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

// book tour
route.post("/bookTour" , async function(req,res){
    const tourData = await tour.findById(req.body.tour)
    const bookData = await book.create({
        tour:req.body.tour,
        language:req.body.language,
        numberOfGuests:req.body.num,
        price:req.body.price,
        hours:req.body.hours,
        user:req.body.user
    })
    const userData = await user.findByIdAndUpdate(req.body.user,{
        $push:{tours:req.body.tour}
    })
    res.json({
        message:"you just booked the tour",
        status:400,
        data:bookData,
        success:true
    })
})

//get one user by id
route.post("/getOneUser", async function(req, res) {
    try {
      const userId = JSON.parse(req.body.id);
      console.log("Received user ID:", userId);
  
      const userData = await user.findById(userId);
  
      if (!userData) {
        console.log("User not found.");
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      console.log("User data:", userData);
      res.json({
        data: userData,
        success: true,
        message: "done",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

//make review
route.post("/makeReview" , async function(req,res){
    const reviewData = await review.create({
        user:req.body.user,
        book:req.body.book,
        rate:req.body.rate,
        comment:req.body.comment,
        tourGideRate:req.body.tourGideRate,
        tourGideComment:req.body.tourGideComment,
        cameraOperatorRate:req.body.cameraOperatorRate,
        cameraOperatorComment:req.body.cameraOperatorComment,
        directorRate:req.body.directorRate,
        directorComment:req.bodydirectorComment
    })
    const bookData =await book.findById(req.body.book)
    const tourData = await tour.findByIdAndUpdate(bookData.tour,{
        $push:{reviews:reviewData._id},
        $inc :{allRate:reviewData.rate},
    })
    const tourData2 = await tour.findById(bookData.tour)
    const tourData3 = await tour.findByIdAndUpdate(bookData.tour,{
        avgRate:tourData2.allRate/tourData2.reviews.length        
    })
    if(bookData.language=="Arabic"){
    const tourGuideData = await tourGuide.findByIdAndUpdate(tourData2.arabicTourGuide,{
        $push:{reviews:reviewData._id},
        $inc :{allRate:reviewData.tourGideRate},
    })
    const tourGuideData2 = await tourGuide.findById(tourData2.arabicTourGuide)
    const tourGuideData3 = await tourGuide.findByIdAndUpdate(tourData2.arabicTourGuide,{
        avgRate:tourGuideData2.allRate/tourGuideData2.reviews.length
    })
    const cameraOperatorData =await cameraOperator.findByIdAndUpdate(tourData2.arabicCameraOperator,{
        $push:{reviews:reviewData._id},
        $inc :{allRate:reviewData.cameraOperatorRate},
    })
    const cameraOperatorData2 = await cameraOperator.findById(tourData2.arabicCameraOperator)
    const cameraOperatorData3 = await cameraOperator.findByIdAndUpdate(tourData2.arabicCameraOperator,{
        avgRate:cameraOperatorData2.allRate/cameraOperatorData2.reviews.length
    })
    const directorData =await director.findByIdAndUpdate(tourData2.arabicDirector,{
        $push:{reviews:reviewData._id},
        $inc :{allRate:reviewData.directorRate},
    })
    const directorData2 = await director.findById(tourData2.arabicDirector)
    const directorData3 = await director.findByIdAndUpdate(tourData2.arabicDirector,{
        avgRate:directorData2.allRate/directorData2.reviews.length
    })

    }
    else if(bookData.language=="English"){
        const tourGuideData = await tourGuide.findByIdAndUpdate(tourData2.englishTourGuide,{
            $push:{reviews:reviewData._id},
            $inc :{allRate:reviewData.tourGideRate},
        })
        const tourGuideData2 = await tourGuide.findById(tourData2.englishTourGuide)
        const tourGuideData3 = await tourGuide.findByIdAndUpdate(tourData2.englishTourGuide,{
            avgRate:tourGuideData2.allRate/tourGuideData2.reviews.length
        })
        const cameraOperatorData =await cameraOperator.findByIdAndUpdate(tourData2.englishCameraOperator,{
            $push:{reviews:reviewData._id},
            $inc :{allRate:reviewData.cameraOperatorRate},
        })
        const cameraOperatorData2 = await cameraOperator.findById(tourData2.englishCameraOperator)
        const cameraOperatorData3 = await cameraOperator.findByIdAndUpdate(tourData2.englishCameraOperator,{
            avgRate:cameraOperatorData2.allRate/cameraOperatorData2.reviews.length
        })
        const directorData =await director.findByIdAndUpdate(tourData2.englishDirector,{
            $push:{reviews:reviewData._id},
            $inc :{allRate:reviewData.directorRate},
        })
        const directorData2 = await director.findById(tourData2.englishDirector)
        const directorData3 = await director.findByIdAndUpdate(tourData2.englishDirector,{
            avgRate:directorData2.allRate/directorData2.reviews.length
        })
    
           
    }
    else if(bookData.language=="Italian"){
        const tourGuideData = await tourGuide.findByIdAndUpdate(tourData2.italianTourGuide,{
            $push:{reviews:reviewData._id},
            $inc :{allRate:reviewData.tourGideRate},
        })
        const tourGuideData2 = await tourGuide.findById(tourData2.italianTourGuide)
        const tourGuideData3 = await tourGuide.findByIdAndUpdate(tourData2.italianTourGuide,{
            avgRate:tourGuideData2.allRate/tourGuideData2.reviews.length
        })
        const cameraOperatorData =await cameraOperator.findByIdAndUpdate(tourData2.italianCameraOperator,{
            $push:{reviews:reviewData._id},
            $inc :{allRate:reviewData.cameraOperatorRate},
        })
        const cameraOperatorData2 = await cameraOperator.findById(tourData2.italianCameraOperator)
        const cameraOperatorData3 = await cameraOperator.findByIdAndUpdate(tourData2.italianCameraOperator,{
            avgRate:cameraOperatorData2.allRate/cameraOperatorData2.reviews.length
        })
        const directorData =await director.findByIdAndUpdate(tourData2.italianDirector,{
            $push:{reviews:reviewData._id},
            $inc :{allRate:reviewData.directorRate},
        })
        const directorData2 = await director.findById(tourData2.italianDirector)
        const directorData3 = await director.findByIdAndUpdate(tourData2.italianDirector,{
            avgRate:directorData2.allRate/directorData2.reviews.length
        })
    
           
    }
    res.json({
        status:400,
        data:reviewData,
        success:true,
        message:"thank you for making review"
    })
})

//get user by id 
route.get("/getUser", async function(req,res){
    const userData= await user.findById(req.bosy.id)
    res.send(userData)
} )
// edit informatiom
route.put("/editInfo" , async function(req,res){
    console.log(req.body.id)
    const userData = await user.findByIdAndUpdate(JSON.parse(req.body.id),{
        name:req.body.name,
        phone:req.body.phone,
        description:req.body.description,
        address:req.body.address,
        city:req.body.city
    })
    // const userData2 = await user.findById(req.body.id)
    res.json({
        success:true,
        message:"YOur Info Updated successfuly",
        status:400,
        data:userData
    })
})

//edit image
route.put("/editImage",upload.single('img'),async function (req,res){
    console.log(req.file)
    const userData = await user.findByIdAndUpdate(req.body.id,{
      img:req.file.filename
    })
    res.json({
        success:true,
        message:"YOur Image Updated successfuly",
        status:400,
        data:userData
    })
  })

  //edit user cover image
route.put("/editCoverImage",upload.single('coverImg'),async function (req,res){
    console.log(req.file)
    const userData = await user.findByIdAndUpdate(req.body.id,{
      coverImg:req.file.filename
    })
    res.json({
        success:true,
        message:"YOur Cover Image Updated successfuly",
        status:400,
        data:userData
    })
  })
  

  // get one tour
route.get("/oneTour", async function(req,res){
    console.log(req.query.id)
    const tourData = await tour.findById(req.query.id).populate("arabicTourGuide").populate("arabicCameraOperator")
    .populate("arabicDirector").populate("englishTourGuide").populate("englishCameraOperator")
    .populate("englishDirector").populate("italianTourGuide").populate("italianCameraOperator")
    .populate("italianDirector").populate({
        path: "reviews",
        populate: {
          path: "book",
          populate:{path:"user"}
        },
      });
    res.send(tourData)
})


// get all vip categories
route.get("/vip", async function(req,res){
    const tourData = await tour.find({category:"vip"})
    res.send(tourData)
})

// get all public categories
route.get("/public", async function(req,res){
    const tourData = await tour.find({category:"public"})
    res.send(tourData)
})

//get all books of the user
route.get("/getBooks", async function(req,res){
    console.log(req.query)
    const bookData = await book.find({user:new ObjectId(JSON.parse(req.query.id))}).populate("tour")
    res.send(bookData)
})
module.exports = route;
