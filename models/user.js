const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name:{
        type: String,
        // require: true,
    },
    email:{
        type: String,
        // require: true,
    },
    password:{
        type: String,
        // require: true,
    },
    phone:{
        type: String,
    },
    address:{
        type: String,
    },
    city:{
        type: String,
    },
    img:{
        type: String,
        default: 'default-user.png'
    },
    coverImg:{
        type: String,
        default: 'default-cover.jpg'
    },
    joinedAt:{
        type: Date,
        default: Date.now,
    },
    description:{
        type: String,
    },
    tours:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"tours"}
    ]

},{
    versionKey:false,
     strict:false,
  })

const user = mongoose.model("user", userSchema);
module.exports = user;