const mongoose = require("mongoose");
const toursSchema = mongoose.Schema({
    title:{
        type: String,
        // require: true,
    },
    description:{
        type: String,
        // require: true,
    },
    hours:{
        type:Number,
        // require: true,
    },
    address:{
        type: String,
        // require: true,
    },
    location:{
        type: String,
        // require: true,
    },
    tags:[
        {type: String,}
    ],
    time:{
        type:Date,
        // require: true,
    },
    date:{
        type:Date,
        // require: true,
    },
    price:{
        type:Number,
        // require: true,
    },
    avgRate:{
        type: Number,
    },
    img:[
        {type:String}
    ],
    stream:[
        {type:String}
    ],
    instructions:[
        {type:String}
    ],
    arabicTourGuide:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tourGuide"
    },
    englishTourGuide:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tourGuide"
    },
    italianTourGuide:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tourGuide"
    },
    arabicCameraOperator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cameraOperator"
    },
    englishCameraOperator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cameraOperator"
    },
    italianCameraOperator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cameraOperator"
    },
    arabicDirector:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"director"
    },
    englishDirector:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"director"
    },
    italianDirector:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"director"
    },
    category:{
        type: String,
        enum: ['public', 'VIP'],
        default:'public'
    }
},{
    versionKey:false,
     strict:false,
  })
const tours = mongoose.model("tours", toursSchema);
module.exports = tours;