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
    img: {
        type: String,
        // default:
    },
    

},
{
    versionKey:false,
     strict:false,
})

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;