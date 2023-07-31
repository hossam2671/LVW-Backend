const mongoose = require("mongoose");
const cameraOperatorSchema = mongoose.Schema({
    name:{
        type: String,
        // require: true,
    },
    email:{
        type: String,
        // unique: true,
        // require: true
    },
    password:{
        type: String,
        // min: 6
        // require: true,
    },
    img:{
        type: String,
        // default:
    },
    coverImg:{
        type: String,
        // default:
    },
    languages:[
        {type: String},
    ],
    address:{
        type: String,
    },
    city:{
        type: String,
    },
    joinedAt:{
        type: Date,
    },
    faculty:{
        type:String,
    },
    university:{
        type: String,
    },
    startYear:{
        type: Number,
    },
    graduateYear:{
        type: Number,
    },
    description:{
        type: String,
    },
    tours:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"tours"}
    ],
    reviews:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"tourReview"}
    ],
    experience:{
        type: String,
    },
    avgRate:{
        type: Number,
    },
    allRate:Number,
    license:{
        type: String,
        // require: true,
    },
    cv:{
        type: String,
        // require: true,
    },
    // role:{
       
    //     type: String,
    //     enum: ['cameraOperator', 'headCameraOperator'],
    //     default:'cameraOperator'
    // },

    status:{
        type:String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }

},{
    versionKey:false,
     strict:false,
  })

const cameraOperator = mongoose.model("cameraOperator", cameraOperatorSchema);
module.exports = cameraOperator;