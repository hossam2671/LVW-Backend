const mongoose = require("mongoose");
const tourReviewSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    tour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tours"
    },
    rate:{
        type: Number,
    },
    comment:{
        type: String,
    },
    tourGideRate:{
        type:Number,
    },
    tourGideComment:{
        type:String,
    },
    cameraOperatorRate:{
        type:Number,
    },
    cameraOperatorComment:{
        type:String,
    },
    directorRate:{
        type:Number,
    },
    directorComment:{
        type:String,
    },
    language:{
        type: String,
        enum: ['Italian', 'English', 'Arabic'],
    }
})

const tourReview = mongoose.model("tourReview", tourReviewSchema);
module.exports = tourReview;