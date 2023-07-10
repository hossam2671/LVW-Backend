const mongoose = require("mongoose");
const directorSchema = mongoose.Schema({
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
    experience:{
        type: String,
    },
    avgRate:{
        type: Number,
    },
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
    //     enum: ['director', 'headDirector'],
    //     default:'director'
    // }

})

const director = mongoose.model("director", directorSchema);
module.exports = director;