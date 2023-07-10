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
    img:{
        type: String,
        // default:
    },
    coverImg:{
        type: String,
        // default:
    },
    joinedAt:{
        type: Date,
    },
    description:{
        type: String,
    },
    tours:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"tours"}
    ]

})

const user = mongoose.model("user", userSchema);
module.exports = user;