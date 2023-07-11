const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validators");


const citySchema = new mongoose.Schema({
    country_id:{
        type: Schema.Types.ObjectId,
        required:true
    },
    city:{
        type : String,
        unique:true,
        required:true
    },
    coordinates :{
        type: [],
        required:true
    }
})

const city  = mongoose.model("city", citySchema)
module.exports = city; 