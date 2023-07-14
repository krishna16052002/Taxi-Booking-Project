const mongoose = require("mongoose");
const validator = require("validators");

const userschema = new mongoose.Schema({
    username: {
        type: String,
    },
    useremail: {
        type: String,
        required:true,
        unique:true
    },
    userphonenumber: {
        type: String,
        required:true,
        unique:true
    },
    usercountrycode: {
        type: String,
    },
    image: {
        type: String,
    },
    customer_id:{
        
    }
});

const user = mongoose.model("user", userschema);
// exports.admin
module.exports = user;

