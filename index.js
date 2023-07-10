// Call The Connection File
require("./config/connection");
const express = require("express");
const app = express();
const server = require('http').createServer(app)

const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(express.static('uploads'))


// calling middlewares : 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/',function(req,res)
{
    res.send("welcome LVW Team")
})

// Call Routes : 
const ObjectId = require("mongodb").ObjectId;


// port listening

server.listen(5000,function()
{
    console.log("listen");
})
// 