const mongoose = require("mongoose");

const createrideSchema = mongoose.Schema(
  {
    paymentoption: {},
    ridetime: {},
    date: {},
    time: {},
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "vehicle",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cities",
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "drivers",
    },
    startlocation: {},
    destinationlocation: {},
    waypoints: {},
    totaldistance: {},
    totaltime: {},
    estimatetime: {},
    estimatefare: {},
    assigned:{ type:String, default:"pending"},
    created:{type:String,default:Date.now()},
    // nearest: {
    //   type: String,
    //   validate: {
    //     validator: function (status) {
    //       const statusRegex = /^[0-1]$/;
    //       return statusRegex.test(status);
    //     },
    //     message: "Invalid status code enter 0 or 1",
    //   },
    //   trim: true,
    //   default: "0",
    // },
    nearest :{
      type:Boolean
    }
  }
);

const createride = mongoose.model("createride", createrideSchema);

module.exports = createride;