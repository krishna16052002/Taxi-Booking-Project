const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/project" ).then(()=>{
    console.log("connection database successfulll.");
}).catch((err)=>{
    console.log("connection is not successful ")
})