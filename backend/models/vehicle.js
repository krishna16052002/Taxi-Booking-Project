const mongoose = require("mongoose");
const validator = require("validators");

const vehicletypeSchema = new mongoose.Schema({
    vehiclename:{ 
        type : String,
        lowercase :true,
        required:true,
        unique:true,
    },
    image:{
        type : String,
        
    }
})


const vehicle = mongoose.model('vehicles', vehicletypeSchema);

module.exports = vehicle; 