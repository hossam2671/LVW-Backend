const mongoose = require("mongoose");
const tourReviewSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"book"
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
},{
    versionKey:false,
     strict:false,
  })

const tourReview = mongoose.model("tourReview", tourReviewSchema);
module.exports = tourReview;