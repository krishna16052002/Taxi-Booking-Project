const mongoose = require("mongoose");
const validator = require("validators");

const countrySchema = new mongoose.Schema({
    countryname:{ 
        type : String,
        required:true,
        unique:true
    },
    countrycode:{
        type : String
    },
    countrytimezone:{
        type : String
    },
    countrycurrency:{
        type : String
    },
    flag:{
        type : String
    }
})


const country = mongoose.model('country', countrySchema);

module.exports = country; 
