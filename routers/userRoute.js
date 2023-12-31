const express = require("express");
const route = express.Router();
const { ObjectId } = require('mongoose').Types;
const cors = require("cors")
const cookieParser = require("cookie-parser");
const moment = require('moment-timezone');


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
    try {
        if (req.body.userType == "user") {
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
    if(!req.body.language){
        res.json({
            message:"enter the language of the tour",
            status:200,
            success:false
        })    
    }else if(!req.body.num){
        res.json({
            message:"Enter the number of guwsts",
            status:200,
            success:false
        })
    }
    else if(!req.body.hours){
        res.json({
            message:"Enter the hours",
            status:200,
            success:false
        })
    }
    else if(!req.body.user){
        res.json({
            message:"login first",
            status:200,
            success:false
        })
    }else{
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
}
})

//get one user by id
route.post("/getOneUser", async function(req, res) {
    try {
      const userId = req.body.id;
  
      const userData = await user.findById(userId);
  
      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.json({
        data: userData,
        success: true,
        message: "done",
      });
    } catch (error) {
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
        tourGideRate:req.body.tourGuideRate,
        tourGideComment:req.body.tourGuideComment,
        cameraOperatorRate:req.body.cameraOperatorRate,
        cameraOperatorComment:req.body.cameraOperatorComment,
        directorRate:req.body.directorRate,
        directorComment:req.body.directorComment
    })

    const bookData =await book.findById(req.body.book)
    const bookData4 = await book.findByIdAndUpdate(req.body.book,{
        isReviewed:true
    }) 
    const bookData3 =await tour.findById(bookData.tour)
    const tourData = await tour.findByIdAndUpdate(bookData.tour,{
        $push:{reviews:reviewData._id},
        $set :{allRate:bookData3.allRate?(bookData3.allRate+reviewData.rate):reviewData.rate},
    })
    const tourData2 = await tour.findById(bookData.tour)
    const tourData3 = await tour.findByIdAndUpdate(bookData.tour,{
        avgRate:tourData2.allRate/tourData2.reviews.length        
    })
    if(bookData.language=="Arabic"){
        const tourGuideData4 = await tourGuide.findById(tourData2.arabicTourGuide)
        const tourGuideData = await tourGuide.findByIdAndUpdate(tourData2.arabicTourGuide,{
            $push:{reviews:reviewData._id},
            $set :{allRate:tourGuideData4.allRate?(reviewData.tourGideRate+tourGuideData4.allRate):reviewData.tourGideRate},
        })
        const tourGuideData2 = await tourGuide.findById(tourData2.arabicTourGuide)
        const tourGuideData3 = await tourGuide.findByIdAndUpdate(tourData2.arabicTourGuide,{
            avgRate:tourGuideData2.allRate/tourGuideData2.reviews.length
    })
    const cameraOperatorData4 = await cameraOperator.findById(tourData2.arabicCameraOperator)
    const cameraOperatorData =await cameraOperator.findByIdAndUpdate(tourData2.arabicCameraOperator,{
        $push:{reviews:reviewData._id},
        $set :{allRate:cameraOperatorData4.allRate?(reviewData.cameraOperatorRate+cameraOperatorData4.allRate):reviewData.cameraOperatorRate},
    })
    const cameraOperatorData2 = await cameraOperator.findById(tourData2.arabicCameraOperator)
    const cameraOperatorData3 = await cameraOperator.findByIdAndUpdate(tourData2.arabicCameraOperator,{
        avgRate:cameraOperatorData2.allRate/cameraOperatorData2.reviews.length
    })
    const directorData4 = await director.findById(tourData2.arabicDirector)
    const directorData =await director.findByIdAndUpdate(tourData2.arabicDirector,{
        $push:{reviews:reviewData._id},
        $set :{allRate:directorData4.allRate?(reviewData.directorRate+directorData4.allRate):reviewData.directorRate},
    })
    const directorData2 = await director.findById(tourData2.arabicDirector)
    const directorData3 = await director.findByIdAndUpdate(tourData2.arabicDirector,{
        avgRate:directorData2.allRate/directorData2.reviews.length
    })

    }
    else if(bookData.language=="English"){
        const tourGuideData4 = await tourGuide.findById(tourData2.englishTourGuide)
        const tourGuideData = await tourGuide.findByIdAndUpdate(tourData2.englishTourGuide,{
            $push:{reviews:reviewData._id},
            $set :{allRate:tourGuideData4.allRate?(reviewData.tourGideRate+tourGuideData4.allRate):reviewData.tourGideRate},
        })
        const tourGuideData2 = await tourGuide.findById(tourData2.englishTourGuide)
        const tourGuideData3 = await tourGuide.findByIdAndUpdate(tourData2.englishTourGuide,{
            avgRate:tourGuideData2.allRate/tourGuideData2.reviews.length
        })
        const cameraOperatorData4 = await cameraOperator.findById(tourData2.englishCameraOperator)
        const cameraOperatorData =await cameraOperator.findByIdAndUpdate(tourData2.englishCameraOperator,{
            $push:{reviews:reviewData._id},
            $set :{allRate:cameraOperatorData4.allRate?(reviewData.cameraOperatorRate+cameraOperatorData4.allRate):reviewData.cameraOperatorRate},
        })
        const cameraOperatorData2 = await cameraOperator.findById(tourData2.englishCameraOperator)
        const cameraOperatorData3 = await cameraOperator.findByIdAndUpdate(tourData2.englishCameraOperator,{
            avgRate:cameraOperatorData2.allRate/cameraOperatorData2.reviews.length
        })
        const directorData4 = await director.findById(tourData2.englishDirector)
        const directorData =await director.findByIdAndUpdate(tourData2.englishDirector,{
            $push:{reviews:reviewData._id},
            $set :{allRate:directorData4.allRate?(reviewData.directorRate+directorData4.allRate):reviewData.directorRate},
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
    if(!req.body.name){
        res.json({
            success:false,
            message:"You must Add Name",
            status:400,
        })    
    }
    else if(!req.body.phone){
        res.json({
            success:false,
            message:"You must Add phone",
            status:400,
        })
    }
    else if(!req.body.address){
        res.json({
            success:false,
            message:"You must Add Address",
            status:400,
        })
    }
    else if(!req.body.city){
        res.json({
            success:false,
            message:"You must Add City",
            status:400,
        })
    }
    else {
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
}
})

//edit image
route.put("/editImage",upload.single('img'),async function (req,res){
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
    const tourData = await tour.find({category:"VIP"})
    res.send(tourData)
})

// get all public categories
route.get("/public", async function(req,res){
    const tourData = await tour.find({category:"public"})
    res.send(tourData)
})

//get all books of the user
route.get("/getBooks", async function(req,res){
    const bookData = await book.find({user:new ObjectId(JSON.parse(req.query.id))}).populate("tour")
    res.send(bookData)
})

// get all live tours happening now
route.get("/liveTours", async function(req, res) {
    try {
        const currentTime = moment().tz('Africa/Cairo'); // Get the current time
        console.log(typeof currentTime)
        console.log("ggggg",new Date(currentTime));
        const tourData = await tour.find({});
        const liveTours = [];

        for (const tour of tourData) {
            console.log(tour.startTime);
            console.log(tour.endTime);


            if (
                new Date(tour.startTime) <= new Date(currentTime) && // Check if tour's start time is less than or equal to the current time
                new Date(tour.endTime) > new Date(currentTime)     // Check if tour's end time is greater than the current time
            ) {
                liveTours.push(tour);
            }
        }

        console.log("Live Tours:", liveTours); // Debug: Log live tours

        res.json({
            success: true,
            data: liveTours,
            message: "Live tours happening now",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// route.get("/liveTours", async function (req, res) {
//     try {
//         const currentTime = moment().tz('Africa/Cairo'); // Get the current time
//         const currentDate = currentTime.format('YYYY-MM-DD'); // Get the current date as 'YYYY-MM-DD'

//         console.log("Current Date:", currentDate);
//         console.log("Current Time:", currentTime);
//         console.log(typeof(currentTime))


//         const rawCurrentTime = moment();
//         console.log("Raw Current Time:", rawCurrentTime);


//         const tourData = await tour.find({});
//         const liveTours = [];

//         for (const tour of tourData) {
//             const tourStartTime = moment(tour.startTime).tz('Africa/Cairo');
//             const tourEndTime = moment(tour.endTime).tz('Africa/Cairo');

//             // Check if the tour's date is the same as the current date
//             if (tourStartTime.isSame(currentDate, 'day')) {
//                 // Check if the tour's start time is less than or equal to the current time
//                 if (tourStartTime.isSameOrBefore(currentTime)) {
//                     liveTours.push(tour);
//                 }

//                 // Check if the tour's end time is in the past (i.e., it has finished)
//                 if (tourEndTime.isSame(currentTime, 'second')) {
//                     // Remove the tour from the liveTours array if it has finished
//                     const index = liveTours.findIndex(t => t._id === tour._id);
//                     if (index !== -1) {
//                         liveTours.splice(index, 1);
//                     }
//                 }
//             }
//         }

//         console.log("Live Tours:", liveTours); // Debug: Log live tours

//         res.json({
//             success: true,
//             data: liveTours,
//             message: "Live tours happening now",
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }

// });



// get number of Travelers
route.get("/allTravelers", async function(req,res){
    const bookData = await book.find()
    let travelers = 0
    for (const book of bookData) {
        travelers += book.numberOfGuests
    }    
    res.send({travelers:travelers})
})

//get popular tours
route.get("/popularTours",async function(req,res){
    const tourData = await tour.find({}).sort({avgRate:-1}).limit(6)
    res.send(tourData)
})

//get popular reviews
route.get("/popularReviews", async function(req,res){
    const reviewData = await review.find({}).sort({rate:-1}).limit(6).populate("user")
    res.send(reviewData)
})

module.exports = route;
