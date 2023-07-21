const mongoose = require("mongoose");
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        //require: true,
    },
    email: {
        type: String,
        //unique: true,
        //require: true,
    },
    password: {
        type: String,
        // min: 6
        // require: true,
    },
    phone:{
        type: String,
    },
    address:{
        type: String,
    },
    img: {
        type: String,
        // default: ''
    },
    coverImg:{
        type: String,
        // default:''
    },
    role:{
        type: String,
        enum: ['admin', 'headAdmin'],
        default:'admin'
    }
},
{
    versionKey:false,
     strict:false,
})

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;