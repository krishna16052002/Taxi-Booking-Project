const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validators");


const pricingSchema = new mongoose.Schema({
    country_id:{
        type: Schema.Types.ObjectId,
        required:true
    },
    city_id: {
        type: Schema.Types.ObjectId,
        required:true
    },
    vehicle_id: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'vehicles' 
    },
    driverprofit:{
        type: String,
        required:true
    },
    minfare:{
        type:String,
        required:true
    },
    distanceforbaseprice: {
        type: String,
        required:true
    },
    baseprice: {
        type: String,
        required:true
    },
    priceperunitdistance:{
        type:String,
        required:true 
    },
    priceperunittime:{
        type:String,
        required:true
    },
    maxspace:{
        type:String,
        required:true
    }


});
pricingSchema.index({ city_id: 1, vehicle_id: 1 }, { unique: true });
const pricing  = mongoose.model("pricing", pricingSchema )
module.exports = pricing; 