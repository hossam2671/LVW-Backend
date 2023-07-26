// Call The Connection File
require("./config/connection");
const express = require("express");
const app = express();
const server = require('http').createServer(app)
const bodyParser = require('body-parser');

const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(express.static('uploads'))


// calling middlewares : 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/',function(req,res)
{
    res.send("welcome LVW Team")
})

// Call Routes : 
const ObjectId = require("mongodb").ObjectId;

const technicalRoute = require("./routers/technicalRoute")
const adminRoute = require("./routers/adminRoute")
const userRoute = require('./routers/userRoute')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/technical', technicalRoute)
app.use('/admin', adminRoute)
app.use('/user', userRoute)



// port listening

server.listen(5000,function()
{
    console.log("listen");
})
// 