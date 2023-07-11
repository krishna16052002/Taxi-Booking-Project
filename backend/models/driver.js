const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validators");


const driverSchema = new mongoose.Schema({
    country_id:{
        type: Schema.Types.ObjectId,
    },
    city_id: {
        type: Schema.Types.ObjectId,
    },
    drivername: {
        type: String
    },
    driveremail: {
        type: String,
        required:true,
        unique:true
    },
    driverphonenumber: {
        type: String,
        required:true,
        unique:true
    },
    drivercountrycode: {
        type: String
    },
    image: {
        type: String
    },
    assignService:{
        type: Schema.Types.ObjectId,
    },
    status:{
        type:Boolean ,
        default: false
    },
    type:{
        type:String,
        default:"None"
    },
    assign:{
        type:String,
        default:"0"
    }

});

const driver  = mongoose.model("driver", driverSchema)
module.exports = driver; 