const mongoose = require("mongoose");
const bookSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    tour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tours"
    },
    tourGuide:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tourGuide"
    },
    cameraOperator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cameraOperator"
    },
    director:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"director"
    },
    price:{
        type: Number,
        
    },
    numberOfGuests:{
        type: Number,
        // require: true,
    },
    language:{
        type: String,
        enum: ['Italian', 'English', 'Arabic'],
        // require: true,
    },
    hours:{
        type:Number,
        // require: true,
    }

})
const book = mongoose.model("book", bookSchema);
module.exports = book;