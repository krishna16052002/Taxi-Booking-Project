const mongoose = require("mongoose");
const validator = require("validators");

const registrationSchema = new mongoose.Schema({
    adminname:{ 
        type : String
    },
    email:{
        type : String
    },
    password:{
        type:String
    },
    token:{
        type:String
    }
})


const admin = mongoose.model('admin', registrationSchema);
// exports.admin
module.exports = admin; 