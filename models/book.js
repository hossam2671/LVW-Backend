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

},{
    versionKey:false,
     strict:false,
  })
const book = mongoose.model("book", bookSchema);
module.exports = book;